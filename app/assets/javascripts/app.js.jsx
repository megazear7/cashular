class App extends React.Component {
    render() {
        return(
            <Layout title="Cashular">
                <Header title={this.props.title}>
                    <TabBar>
                        <Tab href="#scroll-tab-1" className="is-active">Spending</Tab>
                        <Tab href="#scroll-tab-2">Transactions</Tab>
                        <Tab href="#scroll-tab-3">Envelopes</Tab>
                    </TabBar>
                </Header>
                <Drawer title={this.props.title} />
                <Content>
                    <TabPanel className="is-active" id="scroll-tab-1">
                        <Spending />
                    </TabPanel>
                    <TabPanel id="scroll-tab-2">
                        <Transactions />
                    </TabPanel>
                    <TabPanel id="scroll-tab-3">
                        <Envelopes />
                    </TabPanel>
                </Content>
            </Layout>
        );
    }
}

$(document).ready(function() {
    ReactDOM.render(<App title="Cashular" />, document.getElementById('react-root'));
});
