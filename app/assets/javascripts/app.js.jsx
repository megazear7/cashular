class App extends React.Component {
    constructor(props) {
        super(props);

        this.setDateRange = this.setDateRange.bind(this);
        this.setExplorerEnvelope = this.setExplorerEnvelope.bind(this);
        this.load = this.load.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.variables = this.variables.bind(this);
        this.onSwitchChange = this.onSwitchChange.bind(this);

        this.state = { user: this.props.user,
                       loading: false,
                       organizerPage: 1,
                       arrangerPage: 1,
                       explorerPage: 1,
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

        variables.organizerPage = 1;
        variables.arrangerPage = 1;
        variables.explorerPage = 1;

        self.setState({loading: true});
        Cashular.Queries.CashApp(variables, function() {
            var newState = {user: this.user,
                            organizerPage: 1,
                            arrangerPage: 1,
                            explorerPage: 1};

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

    loadMore(baseName) {
        var self = this;

        return function() {
            var variables = self.variables();

            var pageKey = baseName + "Page";
            var transactionsKey = baseName + "Transactions";

            variables[pageKey] = self.state[pageKey] + 1;

            self.setState({loading: true});
            Cashular.Queries.CashApp(variables, function() {
                var user = this.user;
                self.setState(function(prevState) {
                    var state = prevState;
                    state.user[transactionsKey] = state.user[transactionsKey].concat(user[transactionsKey]);
                    state[pageKey] = prevState[pageKey] + 1;
                    return state;
                }, function() {
                    self.setState({loading: false});
                });
            });
        };
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

    onSwitchChange(isOn) {
        var self = this;
        console.log(isOn);
        self.setState({showingNonDeleted: isOn}, function() {
            self.load();
        });
    }

    componentDidUpdate() {
        if (this.loadingBar) {
            componentHandler.upgradeElement(this.loadingBar);
        }
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
                        <Organizer user={this.state.user}
                                   load={this.load}
                                   loadMore={this.loadMore("organizer")} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-3">
                        <Arranger user={this.state.user}
                                          load={this.load}
                                          loadMore={this.loadMore("arranger")}
                                          showingNonDeleted={this.state.showingNonDeleted}
                                          onSwitchChange={this.onSwitchChange} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-4">
                        <Explorer user={this.state.user}
                                  dateRange={this.state.dateRange}
                                  load={this.load}
                                  loadMore={this.loadMore("explorer")}
                                  explorerEnvelope={this.state.explorerEnvelope}
                                  setExplorerEnvelope={this.setExplorerEnvelope} />
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
