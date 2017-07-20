class Explorer extends React.Component {
    constructor(props) {
        super(props);

        this.loadMore = this.loadMore.bind(this);
        this.load = this.load.bind(this);

        this.state = { transactions: [ ], pageSize: 10 };
    }

    loadMore() {
        var self = this;

        self.setState(function(prevState) {
            return { pageSize: prevState.pageSize + 10 };
        }, function() {
            self.load();
        });
    }

    load() {
        var self = this;

        Cashular.Transactions().pageSize(self.state.pageSize).fromEnvelope(self.state.envelope.id).all(function(transactions) {
            self.setState({transactions: transactions});
        });
    }

    setEnvelope(envelope) {
        var self = this;
        return function() {
            self.setState({envelope: envelope}, function() {
                self.load();
            });
        }
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={3}>
                    <List>
                        {self.props.envelopes.map(function(envelope, index) {
                            return <ListItem key={"explorer-envelope"+envelope.id} name={"explorer-envelope"+envelope.id} onChange={self.setEnvelope(envelope)}
                                             listname="explorer-envelope"
                                             checked={self.state.envelope && self.state.envelope.id === envelope.id} title={envelope.title} icon="email" />
                        })}
                    </List>
                </Cell>
                <Cell desktop={2} />
                <Cell desktop={3}>
                    <Grid className="transaction-list">
                        {self.state.transactions.map(function(transaction, index) {
                            return <Transaction cost={transaction.amount} description={transaction.description} areaname="explorer"
                                                key={transaction.id} id={transaction.id} envelope_id={transaction.envelope_id}
                                                envelopes={self.props.envelopes} afterOrganize={self.load} />
                        })}
                        {self.state.envelope &&
                            <LoadMore action={self.loadMore} />}
                    </Grid>
                </Cell>
                <Cell desktop={3} />
            </Grid>
        );
    }
}
