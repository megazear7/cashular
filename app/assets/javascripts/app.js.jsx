class App extends React.Component {
    constructor(props) {
        super(props);

        this.setDateRange = this.setDateRange.bind(this);
        this.setExplorerEnvelope = this.setExplorerEnvelope.bind(this);
        this.load = this.load.bind(this);
        this.organizerLoadMore = this.organizerLoadMore.bind(this);
        this.fullTransactionsLoadMore = this.fullTransactionsLoadMore.bind(this);
        this.explorerLoadMore = this.explorerLoadMore.bind(this);
        this.variables = this.variables.bind(this);
        this.onSwitchChange = this.onSwitchChange.bind(this);

        this.state = { user: this.props.user,
                       loading: false,
                       unique: Cashular.Utils.makeid(),
                       showingNonDeleted: true,
                       dateRange: {title: "Previous Week", key: "previous_week", daysAgo: 7} };

        if (this.state.user.envelopes.length > 0) {
            this.state.explorerEnvelope = this.state.user.envelopes[0];
        } else {
            // TODO What do we do here to avoid an error?
        }
    }

    variables() {
        var variables = {
             id: this.state.user.id,
             from: this.state.dateRange.from,
             to: this.state.dateRange.to,
             daysAgo: this.state.dateRange.daysAgo
        };

        if (! this.state.showingNonDeleted) {
            variables.deleted = true;
        }

        return variables;
    }

    load() {
        var self = this;
        var variables = self.variables();

        self.setState({loading: true});
        Cashular.Queries.CashApp(variables, function() {
            var newState = {user: this.user};

            $.each(this.user.envelopes, function() {
                if (self.state.explorerEnvelope.id === this.id) {
                    newState.explorerEnvelope = this;
                }
            });

            self.setState(newState, function() {
                self.setState({loading: false});
            });
        });
    }

    componentDidUpdate() {
        if (this.loadingBar) {
            componentHandler.upgradeElement(this.loadingBar);
        }
    }

    organizerLoadMore(page) {
        var self = this;
        var variables = self.variables();

        variables.organizerPage = page;

        self.setState({loading: true});
        Cashular.Queries.CashApp(variables, function() {
            var user = this.user;
            self.setState(function(prevState) {
                var state = prevState;
                state.user.organizerTransactions = state.user.organizerTransactions.concat(user.organizerTransactions);
                return state;
            }, function() {
                self.setState({loading: false});
            });
        });
    }

    fullTransactionsLoadMore(page) {
        var self = this;
        var variables = self.variables();

        variables.fullTransactionsPage = page;

        self.setState({loading: true});
        Cashular.Queries.CashApp(variables, function() {
            var user = this.user;
            self.setState(function(prevState) {
                var state = prevState;
                state.user.fullTransactions = state.user.fullTransactions.concat(user.fullTransactions);
                return state;
            }, function() {
                self.setState({loading: false});
            });
        });
    }

    explorerLoadMore(page) {
        var self = this;
        var variables = self.variables();

        variables.fullTransactionsPage = page;

        self.setState({loading: true});
        Cashular.Queries.CashApp(variables, function() {
            var user = this.user;
            self.setState(function(prevState) {
                var state = prevState;
                state.user.fullTransactions = state.user.fullTransactions.concat(user.fullTransactions);
                return state;
            }, function() {
                self.setState({loading: false});
            });
        });
    }

    setDateRange(dateRange) {
        var self = this;
        self.setState({dateRange: dateRange}, function() {
            self.load();
        });
    }

    setExplorerEnvelope(envelope) {
        this.setState({explorerEnvelope: envelope});
    }

    onSwitchChange(e) {
        var self = this;
        self.setState({showingNonDeleted: $(self.deletedSwitchInput).is(':checked')}, function() {
            self.load();
        });
    }

    componentDidMount() {
        componentHandler.upgradeElement(this.deletedSwitch);
    }

    render() {
        return(
            <Layout title="Cashular">
                <Drawer title={this.props.title}>
                    <TimeSelector onChange={this.setDateRange} />
                </Drawer>
                <Header >
                    {this.state.loading &&
                        <div id="p2" className="mdl-progress mdl-js-progress mdl-progress__indeterminate"
                                     ref={(el) => { this.loadingBar = el; }}>
                        </div>}
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
                        <Envelopes dateRange={this.state.dateRange}
                                   load={this.load}
                                   gain={this.state.user.gain}
                                   loss={this.state.user.loss}
                                   envelopes={this.state.user.envelopes}
                                   unallocated={this.state.user.unallocated} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-2">
                        <Grid>
                            <Cell desktop={3} tablet={1} phone={0}></Cell>
                            <Cell desktop={5} tablet={6} phone={3} className="centered">
                                <H6>
                                    {this.state.user.organizerTransactions.length > 0 &&
                                        Cashular.Utils.prettyDate(new Date(this.state.user.organizerTransactions[0].post_date))}
                                </H6>
                            </Cell>
                            <Cell desktop={4} tablet={1} phone={1}></Cell>
                            <Cell desktop={3} tablet={1} phone={0}></Cell>
                            <Cell desktop={5} tablet={6} phone={4}>
                                <Transactions load={this.load}
                                              loadMore={this.organizerLoadMore}
                                              count={this.state.user.organizerTransactionCount}
                                              transactions={this.state.user.organizerTransactions}
                                              envelopes={this.state.user.envelopes} />
                            </Cell>
                            <Cell desktop={4} tablet={1} phone={0}></Cell>
                        </Grid>
                    </TabPanel>
                    <TabPanel id="scroll-tab-3">
                        <Grid>
                            <Cell desktop={3} tablet={1} phone={0}></Cell>
                            <Cell desktop={5} tablet={6} phone={3} className="centered">
                                <H6>
                                    {this.state.user.fullTransactions.length > 0 && this.state.showingNonDeleted &&
                                        Cashular.Utils.prettyDate(new Date(this.state.user.fullTransactions[0].post_date))}
                                    {this.state.user.fullTransactions.length > 0 && ! this.state.showingNonDeleted &&
                                        "Deleted Transactions"}
                                </H6>
                            </Cell>
                            <Cell desktop={4} tablet={1} phone={1}>
                                <label className="mdl-switch mdl-js-switch mdl-js-ripple-effect transaction-switch"
                                       htmlFor={this.state.unique+"-show-non-deleted"}
                                       ref={(el) => { this.deletedSwitch = el}}>
                                    <input type="checkbox"
                                           id={this.state.unique+"-show-non-deleted"}
                                           onChange={this.onSwitchChange}
                                           className="mdl-switch__input"
                                           defaultChecked={this.state.showingNonDeleted}
                                       ref={(el) => { this.deletedSwitchInput = el}} />
                                    <span className="mdl-switch__label"></span>
                                </label>
                            </Cell>
                            <Cell desktop={3} tablet={1} phone={0}></Cell>
                            <Cell desktop={5} tablet={6} phone={4}>
                                <Transactions load={this.load}
                                              loadMore={this.fullTransactionsLoadMore}
                                              count={this.state.user.fullTransactionCount}
                                              transactions={this.state.user.fullTransactions}
                                              envelopes={this.state.user.envelopes} />
                            </Cell>
                            <Cell desktop={4} tablet={1} phone={0}></Cell>
                        </Grid>
                    </TabPanel>
                    <TabPanel id="scroll-tab-4">
                        <Grid>
                            <Cell desktop={3} tablet={0} phone={0}></Cell> 
                            <Cell desktop={5} tablet={5} phone={4} className="centered">
                                {typeof this.state.dateRange !== "undefined" && this.state.dateRange.title &&
                                    <H6>{this.state.dateRange.title}</H6>}
                            </Cell>
                            <Cell desktop={4} tablet={3} phone={0}></Cell> 
                            <Cell desktop={3} tablet={0} phone={0}></Cell>
                            <Cell desktop={5} tablet={5} phone={4} className="centered">
                                <Transactions load={this.load}
                                              loadMore={this.explorerLoadMore}
                                              count={this.state.explorerEnvelope.count}
                                              transactions={this.state.explorerEnvelope.transactions}
                                              envelopes={this.state.user.envelopes} />
                            </Cell>
                            <Cell desktop={1} tablet={0} phone={0}></Cell>
                            <Cell desktop={0} tablet={0} phone={4} className="centered">
                                <H5>Select Envelope:</H5>
                            </Cell>
                            <Cell desktop={3} tablet={3} phone={4}>
                                <EnvelopePicker action={this.setExplorerEnvelope}
                                                envelopes={this.state.user.envelopes}
                                                envelope_id={this.state.explorerEnvelope && this.state.explorerEnvelope.id} />
                            </Cell>
                        </Grid>
                    </TabPanel>
                    <TabPanel id="scroll-tab-5">
                        <Uploader addedTransactions={this.load} />
                    </TabPanel>
                </Content>
            </Layout>
        );
    }
};

$(document).ready(function() {
    if (window.location.pathname === "" || window.location.pathname === "/") {
        var variables = {
             id: 2,
             daysAgo: 7
        };

        Cashular.Queries.CashApp(variables, function() {
            ReactDOM.render(<App title="Cashular" user={this.user} />, document.getElementById('react-root'));
            componentHandler.upgradeDom();
        });
    }
});
