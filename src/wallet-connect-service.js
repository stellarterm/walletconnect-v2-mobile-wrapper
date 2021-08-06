import WalletConnect, { CLIENT_EVENTS } from '@walletconnect/client';

const SUPPORTED_CHAINS = {
  stellar: {
    chainNames: ['stellar:pubnet', 'stellar:testnet'],
    methods: ['stellar_signXDR']
  }
};

export class WalletConnectService {
  constructor() {
    this.client = null;
    this.proposal = null;
    this.session = null;
  }

  init(metadata) {
    WalletConnect.init({
      controller: true,
      relayProvider: 'wss://relay.walletconnect.org',
      metadata,
    }).then((result) => {
      this.client = result;
      this.subscribeToEvents();

      this.checkPersistedState();

    });
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

        customPostMessage({
          type: 'session_proposal',
          proposal
        });
      }
    );

    this.client.on(
      CLIENT_EVENTS.session.deleted,
      (session) => {
        customPostMessage({
          type: 'session_deleted',
          session
        });
      }
    );

    this.client.on(CLIENT_EVENTS.session.request, async (requestEvent) => {
      customPostMessage({
        type: 'session_request',
        requestEvents: [requestEvent]
      });
    });
  }

  checkPersistedState() {
    const sessions = this.client.session.values;

    if (sessions.length) {
      customPostMessage({
        type: 'initial_settled_sessions',
        sessions
      });
      customPostMessage({
        type: 'initial_session_requests',
        requestEvents: this.client.session.history.pending
      });
    } else {
      customPostMessage({
        type: 'initial_settled_sessions',
        sessions: []
      });
    }
  }

  pair(uri) {
    this.client.pair({ uri })
      .then(() => {
        customPostMessage({ type: 'pair_success' });
      })
      .catch(() => {
        customPostMessage({ type: 'pair_fail' });
      })
  }

  handleSessionUserApprove(publicKey) {
    const response = {
      state: {
        accounts: [`stellar:pubnet:${publicKey}`],
      },
      metadata: this.client.metadata
    };

    this.client.approve({ proposal: this.proposal, response })
      .then((session) => {
        customPostMessage({
          type: 'session_created',
          session,
        });
        this.proposal = null;
      })
      .catch((error) => {
        customPostMessage({
          type: 'error',
          error
        });
      })


  }

  handleSessionUserReject() {
    this.client.reject({ proposal: this.proposal }).then(() => {
      this.proposal = null;

      customPostMessage({ type: 'session_rejected' });
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
      customPostMessage({ type: 'respond_sent' });
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
