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
                        <Tab href="#scroll-tab-1" className="is-active">Spending</Tab>
                        <Tab href="#scroll-tab-2">Organizer</Tab>
                        <Tab href="#scroll-tab-3">Transactions</Tab>
                    </TabBar>
                </Header>
                <Drawer title={this.props.title} />
                <Content>
                    <TabPanel className="is-active" id="scroll-tab-1">
                        <Envelopes newEnvelope={this.reloadTransactions} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-2">
                        <Transactions onlyUnorganized={true} />
                    </TabPanel>
                    <TabPanel id="scroll-tab-3">
                        <Transactions />
                    </TabPanel>
                </Content>
            </Layout>
        );
    }
}

$(document).ready(function() {
    ReactDOM.render(<App title="Cashular" />, document.getElementById('react-root'));
});
