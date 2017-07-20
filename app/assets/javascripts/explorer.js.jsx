class Explorer extends React.Component {
    constructor(props) {
        super(props);

        this.loadMore = this.loadMore.bind(this);
        this.load = this.load.bind(this);
        this.setEnvelope = this.setEnvelope.bind(this);

        this.state = { transactions: [ ],
                       pageSize: 10,
                       unique: Cashular.Utils.makeid() };
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
        self.setState({envelope: envelope}, function() {
            self.load();
        });
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={3}>
                    <EnvelopePicker action={self.setEnvelope}
                                    envelopes={self.props.envelopes}
                                    envelope_id={self.props.envelope && self.props.envelope.id} />
                </Cell>
                <Cell desktop={2} />
                <Cell desktop={3}>
                    <Grid className="transaction-list">
                        {self.state.transactions.map(function(transaction, index) {
                            return <Transaction cost={transaction.amount} description={transaction.description}
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
