class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };

        this.loadMore = this.loadMore.bind(this);
        this.load = this.load.bind(this);

        this.state.pageSize = 10;
        this.state.transactions = [ ];

        this.load();
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

        var transactions = Cashular.Transactions().pageSize(self.state.pageSize);

        if (self.props.onlyUnorganized) {
            transactions.onlyUnorganized();
        }

        transactions.all(function(transactions) {
            self.setState({transactions: transactions,
                           envelopes: self.props.envelopes});
        });
    }

    render() {
        var self = this;
        return (
            <Grid className="transaction-list">
                {self.state.transactions.map(function(transaction, index) {
                    return <Transaction cost={transaction.amount}
                                        description={transaction.description}
                                        key={transaction.id}
                                        id={transaction.id}
                                        envelope_id={transaction.envelope_id}
                                        envelopes={self.props.envelopes}
                                        afterOrganize={self.load} />
                })}
                <LoadMore action={self.loadMore} />
            </Grid>
        );
    }
}

