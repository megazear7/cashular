class App extends React.Component {
    constructor(props) {
        super(props);

        this.reloadTransactions = this.reloadTransactions.bind(this);
    }

    reloadTransactions() {
        // TODO This is meant to update the envelope list inside the transactions
        // but it doesn't work
        this.forceUpdate();
    }

    render() {
        return(
            <Layout title="Cashular">
                <Header title={this.props.title}>
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
                    </TabBar>
                </Header>
                <Drawer title={this.props.title} />
                <Content>
                    <TabPanel className="is-active" id="scroll-tab-1">
                        <Envelopes newEnvelope={this.reloadTransactions} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-2">
                        <Transactions onlyUnorganized={true} areaname="organizer" />
                    </TabPanel>
                    <TabPanel id="scroll-tab-3">
                        <Transactions areaname="fulllist" />
                    </TabPanel>
                    <TabPanel id="scroll-tab-4">
                        <Explorer envelopes={this.props.envelopes} />
                    </TabPanel>
                </Content>
            </Layout>
        );
    }
}

$(document).ready(function() {
    Cashular.Envelopes().all(function(envelopes) {
        ReactDOM.render(<App title="Cashular" envelopes={envelopes} />, document.getElementById('react-root'));
        componentHandler.upgradeDom();
    });
});
