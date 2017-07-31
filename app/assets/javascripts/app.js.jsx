class App extends React.Component {
    constructor(props) {
        super(props);

        this.setDateRange = this.setDateRange.bind(this);
        this.load = this.load.bind(this);

        this.state = { user: this.props.user,
                       dateRange: {title: "Previous Week", key: "previous_week", daysAgo: 7} };
    }

    load() {
        var self = this;

        var variables = {
             id: self.state.user.id,
             from: self.state.dateRange.from,
             to: self.state.dateRange.to,
             daysAgo: self.state.dateRange.daysAgo
        };

        // TODO re implement the deleted toggle
        if (false && typeof options !== "undefined" && ! options.showingNonDeleted) {
            variables.deleted = true;
        }

        Cashular.Queries.CashApp(variables, function() {
            self.setState({user: this.user});
        });
    }

    setDateRange(dateRange) {
        var self = this;
        self.setState({dateRange: dateRange}, function() {
            self.load();
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
                        <Envelopes dateRange={this.state.dateRange}
                                   load={this.load}
                                   gain={this.state.user.gain}
                                   loss={this.state.user.loss}
                                   envelopes={this.state.user.envelopes}
                                   unallocated={this.state.user.unallocated} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-2">
                        <Transactions load={this.load}
                                      transactions={this.state.user.organizerTransactions}
                                      envelopes={this.state.user.envelopes} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-3">
                        <Transactions load={this.load}
                                      transactions={this.state.user.fullTransactions}
                                      envelopes={this.state.user.envelopes} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-4">
                        <Explorer load={this.load}
                                  dateRange={this.state.dateRange}
                                  envelopes={this.state.user.envelopes} />
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
