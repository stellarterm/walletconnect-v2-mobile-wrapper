import WalletConnect, { CLIENT_EVENTS } from '@walletconnect/client';

const SUPPORTED_CHAINS = {
  stellar: {
    chainNames: ['stellar:pubnet', 'stellar:testnet'],
    methods: ['stellar_signXDR']
  }
};

// methods declared on native platforms
const postMessage = (data) => {
  const stringify = JSON.stringify(data);
  // IOS
  if (window.webkit) {
    try {
      window.webkit.messageHandlers.sumbitToiOS.postMessage(stringify);
    } catch (e) {
      console.log(e)
    }
  }

  // android
  if (window.android) {
    window.android.postMessage(stringify);
  }
}

export class WalletConnectService {
  constructor() {
    this.client = null;
    this.proposal = null;
    this.session = null;
  }

  async init(metadata) {
    this.client = await WalletConnect.init({
      controller: true,
      relayProvider: 'wss://relay.walletconnect.org',
      metadata,
    })

    this.subscribeToEvents();

    this.checkPersistedState();
  }

  subscribeToEvents() {
    this.client.on(
      CLIENT_EVENTS.session.proposal,
      async (proposal) => {
        const { permissions } = proposal;

        this.proposal = proposal;

        const supportedChains = Object.values(SUPPORTED_CHAINS).reduce((acc, chain) => {
          acc.chainNames = [ ...acc.chainNames, ...chain.chainNames];
          acc.methods = [ ...acc.methods, ...chain.methods];
          return acc;
        }, { chainNames: [], methods: []});

        const supportedChainsString = supportedChains.chainNames.join(':');
        const supportedMethodsString = supportedChains.methods.join(':');

        const unsupportedChains = [];

        permissions.blockchain.chains.forEach((chain) => {
          if (!supportedChainsString.includes(chain)) {
            unsupportedChains.push(chain);
          }
        });

        if (unsupportedChains.length) {
          this.handleSessionUserReject(proposal);
          return;
        }

        const unsupportedMethods = [];

        permissions.jsonrpc.methods.forEach((method) => {
          if (!supportedMethodsString.includes(method)) {
            unsupportedMethods.push(method);
          }
        });

        if (unsupportedMethods.length) {
          this.handleSessionUserReject(proposal);
          return;
        }

        postMessage({
          type: 'session_proposal',
          proposal
        });
      }
    );

    this.client.on(
      CLIENT_EVENTS.session.deleted,
      (session) => {
        postMessage({
          type: 'session_deleted',
          session
        });
      }
    );

    this.client.on(CLIENT_EVENTS.session.request, async (requestEvent) => {
      postMessage({
        type: 'session_request',
        requestEvents: [requestEvent]
      });
    });
  }

  checkPersistedState() {
    const sessions = this.client.session.values;

    if (sessions.length) {
      postMessage({
        type: 'initial_settled_sessions',
        sessions
      });
      postMessage({
        type: 'initial_session_requests',
        requestEvents: this.client.session.history.pending
      });
    }
  }

  pair(uri) {
    this.client.pair({ uri })
      .then(() => {
        postMessage({ type: 'pair_success' });
      })
      .catch(() => {
        postMessage({ type: 'pair_fail' });
      })
  }

  handleSessionUserApprove(publicKey) {
    const response = {
      state: {
        accounts: [`${publicKey}@stellar:pubnet`],
      },
      metadata: this.client.metadata
    };

    this.client.approve({ proposal: this.proposal, response })
      .then((session) => {
        postMessage({
          type: 'session_created',
          session,
        });
        this.proposal = null;
      })
      .catch((error) => {
        postMessage({
          type: 'error',
          error
        });
      })


  }

  handleSessionUserReject() {
    this.client.reject({ proposal: this.proposal }).then(() => {
      this.proposal = null;

      postMessage({ type: 'session_rejected' });
    })
  }

  disconnect(topic) {
    this.client.disconnect({
      topic,
      reason: 'logout'
    });
  }

  respond(response) {
    this.client.respond(response).then(() => {
      postMessage({ type: 'respond_sent' });
    })
  }

  respondError(topic, id, errorText) {
    const errorResponse = {
      topic,
      response: {
        id,
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: errorText,
        },
      }
    }

    this.respond(errorResponse);
  }

  respondSuccess(topic, id) {
    const response = {
      topic,
      response: {
        id,
        jsonrpc: '2.0',
        result: 'success'
      },
    };

    this.respond(response);
  }
}
