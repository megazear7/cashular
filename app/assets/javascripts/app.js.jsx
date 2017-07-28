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

        this.state = { envelopes: this.props.envelopes,
                       dateRange: {title: "Previous Week", key: "previous_week", daysAgo: 7},
                       organizerTransactions: [ ],
                       transactions: [ ],
                       explorerTransactionData: { transactions: [ ] }  };

        this.loadEnvelopes();
    }

    loadEnvelopes() {
        var self = this;

        var envelopes = Cashular.Envelopes()
        var unallocated = Cashular.Transactions()
            
        if (typeof self.state.dateRange !== "undefined") {
            if (typeof self.state.dateRange.daysAgo !== "undefined") {
                envelopes.daysAgo(self.state.dateRange.daysAgo);
                unallocated.daysAgo(self.state.dateRange.daysAgo);
            } else if (self.state.dateRange.from !== "undefined") {
                envelopes.from(self.state.dateRange.from).to(self.state.dateRange.to);
                unallocated.from(self.state.dateRange.from).to(self.state.dateRange.to);
            }
        }

        envelopes.all(function(envelopes) {
            self.setState({envelopes: envelopes});
        });

        unallocated.unallocated().done(function(response) {
            self.setState({unallocated: response});
        });
    }

    loadTransactions(options, callback) {
        var self = this;

        var transactions = Cashular.Transactions().pageSize(options.pageSize);

        if (options.onlyUnorganized) {
            transactions.onlyUnorganized();
        }

        if (typeof options.dateRange !== "undefined") {
            if (typeof options.dateRange.daysAgo !== "undefined") {
                transactions.daysAgo(options.dateRange.daysAgo);
            } else if (options.dateRange.from !== "undefined") {
                transactions.from(options.dateRange.from).to(options.dateRange.to);
            }
        }

        if (typeof options.showingNonDeleted !== "undefined" && ! options.showingNonDeleted) {
            transactions.retrieveDeleted();
        }

        if (options.envelope) {
            transactions.fromEnvelope(options.envelope.id);
        }

        transactions.all(function(response) {
            callback(response);
        });
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

        self.loadTransactions(options, function(result) {
            self.setState({transactions: result.transactions,
                           transactionsOptions: options});
        });
    }

    setExplorerTransactions(options) {
        var self = this;

        options.dateRange = self.state.dateRange;

        self.loadTransactions(options, function(result) {
            self.setState({explorerTransactionData: result,
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
                                   envelopes={this.state.envelopes}
                                   unallocated={this.state.unallocated} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-2">
                        <Transactions onlyUnorganized={true}
                                      setTransactions={this.setOrganizerTransactions}
                                      transactions={this.state.organizerTransactions}
                                      envelopes={this.state.envelopes} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-3">
                        <Transactions setTransactions={this.setTransactions}
                                      transactions={this.state.transactions}
                                      envelopes={this.state.envelopes} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-4">
                        <Explorer dateRange={this.state.dateRange}
                                  setTransactions={this.setExplorerTransactions}
                                  transactionData={this.state.explorerTransactionData}
                                  envelopes={this.state.envelopes} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-5">
                        <Uploader addedTransactions={this.setAllTransactions} />
                    </TabPanel>
                </Content>
            </Layout>
        );
    }
}




$(document).ready(function() {
    if (window.location.pathname === "" || window.location.pathname === "/") {
        // Example request to graphql:
        Cashular(`{
        user(id: 1, from:"06/05/2017", organized: true, deleted: false) {
          email
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
            ReactDOM.render(<App title="Cashular" envelopes={this.user.envelopes} />, document.getElementById('react-root'));
            componentHandler.upgradeDom();
        });
    }
});
