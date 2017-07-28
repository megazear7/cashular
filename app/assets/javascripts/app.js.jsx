class App extends React.Component {
    constructor(props) {
        super(props);

        this.setEnvelopes = this.setEnvelopes.bind(this);
        this.setDateRange = this.setDateRange.bind(this);
        this.loadEnvelopes = this.loadEnvelopes.bind(this);
        this.loadTransactions = this.loadTransactions.bind(this);
        this.setOrganizerTransactions = this.setOrganizerTransactions.bind(this);
        this.setTransactions = this.setTransactions.bind(this);
        this.setExplorerTransactions = this.setExplorerTransactions.bind(this);
        this.setAllTransactions = this.setAllTransactions.bind(this);

        this.state = { user: { envelopes: [ ] },
                       dateRange: {title: "Previous Week", key: "previous_week", daysAgo: 7},
                       organizerTransactions: [ ],
                       transactions: [ ],
                       explorerNet: 0,
                       explorerTransactions: [ ] };

        this.loadEnvelopes();
    }

    loadEnvelopes() {
        var self = this;

        var args = Cashular.Utils.graphArgs({
             id: self.props.userId,
             from: self.state.dateRange.from,
             to: self.state.dateRange.to,
             daysAgo: self.state.dateRange.daysAgo
        });

        Cashular(`{
        user(${args}) {
          gain
          loss
          unallocated
          envelopes {
            id
            title
            net
            gain
            loss
            transactions {
              post_date
              description
              amount
            }
          }
        }}`, function() {
            self.setState({user: this.user});
        });
    }

    loadTransactions(options, callback) {
        var self = this;

        // TODO this should have to be two different calls
        if (options.envelope) {
            var args = Cashular.Utils.graphArgs({
                 id: options.envelope.id,
                 from: self.state.dateRange.from,
                 to: self.state.dateRange.to,
                 daysAgo: self.state.dateRange.daysAgo,
                 unorganized: ! options.onlyUnorganized,
                 deleted: ! options.showingNonDeleted
            });

            Cashular(`{
            envelope(${args}) {
              transactions {
                id
                description
                amount
                amount
                post_date
              }
            }}`, function() {
                callback(this.envelope.transactions, this.envelope.net);
            });

        } else {
            var args = Cashular.Utils.graphArgs({
                 id: self.props.userId,
                 from: self.state.dateRange.from,
                 to: self.state.dateRange.to,
                 daysAgo: self.state.dateRange.daysAgo,
                 unorganized: ! options.onlyUnorganized,
                 deleted: ! options.showingNonDeleted
            });

            Cashular(`{
            user(${args}) {
              transactions {
                id
                description
                amount
                amount
                post_date
              }
            }}`, function() {
                callback(this.user.transactions, this.user.net);
            });
        }
    }

    setEnvelopes(envelopes) {
        this.setState({envelopes: envelopes }, function() {
            self.loadEnvelopes();
        });
    }

    setDateRange(dateRange) {
        var self = this;
        self.setState({dateRange: dateRange}, function() {
            self.loadEnvelopes();
            self.setAllTransactions();
        });
    }

    setAllTransactions() {
        var self = this;

        var organizerOptions;
        if (typeof this.state.organizerOptions !== "undefined") {
            organizerOptions = this.state.organizerOptions;
        } else {
            organizerOptions = { };
        }

        var transactionsOptions;
        if (typeof this.state.transactionsOptions !== "undefined") {
            transactionsOptions = this.state.transactionsOptions;
        } else {
            transactionsOptions = { };
        }

        var explorerOptions;
        if (typeof this.state.explorerOptions !== "undefined") {
            explorerOptions = this.state.explorerOptions;
        } else {
            explorerOptions = { };
        }

        organizerOptions.pageSize = 10;
        transactionsOptions.pageSize = 10;
        explorerOptions.pageSize = 10;

        self.setOrganizerTransactions(organizerOptions);
        self.setTransactions(transactionsOptions);
        self.setExplorerTransactions(explorerOptions);
    }

    setOrganizerTransactions(options) {
        var self = this;

        options.onlyUnorganized = true;
        options.dateRange = self.state.dateRange;

        self.loadTransactions(options, function(result) {
            self.setState({organizerTransactionsResponse: result.transactions,
                           organizerOptions: options});
        });
    }

    setTransactions(options) {
        var self = this;

        options.dateRange = self.state.dateRange;

        self.loadTransactions(options, function(transactions) {
            self.setState({transactions: transactions,
                           transactionsOptions: options});
        });
    }

    setExplorerTransactions(options) {
        var self = this;

        options.dateRange = self.state.dateRange;

        self.loadTransactions(options, function(transactions, net) {
            self.setState({explorerTransactions: transactions,
                           explorerNet: net,
                           explorerOptions: options});
        });
    }

    render() {
        return(
            <Layout title="Cashular">
                <Drawer title={this.props.title}>
                    <TimeSelector onChange={this.setDateRange} />
                </Drawer>
                <Header >
                    <TabBar>
                        <Tab href="#scroll-tab-1" className="is-active">
                            <BasicIcon icon="pie_chart" />
                            Spending
                        </Tab>
                        <Tab href="#scroll-tab-2">
                            <BasicIcon icon="view_quilt" />
                            Organizer
                        </Tab>
                        <Tab href="#scroll-tab-3">
                            <BasicIcon icon="toc" />
                            Transactions
                        </Tab>
                        <Tab href="#scroll-tab-4">
                            <BasicIcon icon="group_work" />
                            Envelopes
                        </Tab>
                        <Tab href="#scroll-tab-5">
                            <BasicIcon icon="backup" />
                            Upload
                        </Tab>
                    </TabBar>
                </Header>
                <Content>
                    <TabPanel className="is-active" id="scroll-tab-1">
                        <Envelopes addOrRemoved={this.setEnvelopes}
                                   dateRange={this.state.dateRange}
                                   addOrRemovedEnvelope={this.loadEnvelopes}
                                   gain={this.state.user.gain}
                                   loss={this.state.user.gain}
                                   envelopes={this.state.user.envelopes}
                                   unallocated={this.state.user.unallocated} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-2">
                        <Transactions onlyUnorganized={true}
                                      setTransactions={this.setOrganizerTransactions}
                                      transactions={this.state.organizerTransactions}
                                      envelopes={this.state.user.envelopes} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-3">
                        <Transactions setTransactions={this.setTransactions}
                                      transactions={this.state.transactions}
                                      envelopes={this.state.user.envelopes} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-4">
                        <Explorer dateRange={this.state.dateRange}
                                  setTransactions={this.setExplorerTransactions}
                                  explorerNet={this.state.explorerNet}
                                  transactions={this.state.explorerTransactions}
                                  envelopes={this.state.user.envelopes} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-5">
                        <Uploader addedTransactions={this.setAllTransactions} />
                    </TabPanel>
                </Content>
            </Layout>
        );
    }
};

$(document).ready(function() {
    if (window.location.pathname === "" || window.location.pathname === "/") {
        ReactDOM.render(<App title="Cashular" userId={2} />, document.getElementById('react-root'));
        componentHandler.upgradeDom();
    }
});
