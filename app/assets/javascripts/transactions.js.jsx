class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };

        this.loadMore = this.loadMore.bind(this);

        this.state.page = 1;
    }

    loadMore() {
        var self = this;

        self.setState(function(prevState) {
            return { page: prevState.page + 1 };
        }, function() {
            self.props.loadMore(self.state.page);
        });
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={12}>
                    {self.props.transactions.map(function(transaction, index) {
                        return <Transaction cost={transaction.amount}
                                            post_date={transaction.post_date}
                                            description={transaction.description}
                                            key={transaction.id}
                                            id={transaction.id}
                                            deleted={transaction.deleted}
                                            envelope_id={transaction.envelope_id}
                                            load={self.props.load}
                                            envelopes={self.props.envelopes}
                                            afterOrganize={self.props.load} />
                    })}
                    {self.props.count > self.props.transactions.length &&
                        <LoadMore action={self.loadMore} />}
                </Cell>
            </Grid>
        );
    }
}
