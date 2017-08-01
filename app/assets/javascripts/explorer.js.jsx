class Explorer extends React.Component {
    constructor(props) {
        super(props);

        this.loadMore = this.loadMore.bind(this);

        this.state = { pageSize: 10 };
    }

    loadMore() {
        var self = this;

        self.setState(function(prevState) {
            return { pageSize: prevState.pageSize + 10 };
        }, function() {
            self.props.load();
        });
    }

    render() {
        var self = this;
        return (
            <Cell desktop={5} tablet={5} phone={4} className="centered">
                {typeof self.props.net !== "undefined" && self.props.net !== 0 &&
                    <H6 className={((self.props.net >= 0) ? "green-font" : "orange-font")}>
                        ${Math.abs(self.props.net).toFixed(2)}</H6>}
                {self.props.envelope.transactions.map(function(transaction, index) {
                    return <Transaction cost={transaction.amount}
                                        description={transaction.description}
                                        key={transaction.id}
                                        id={transaction.id}
                                        envelope_id={transaction.envelope_id}
                                        envelopes={self.props.envelopes}
                                        afterOrganize={self.props.load} />
                })}
                {self.props.envelope && self.props.count > self.state.pageSize &&
                    <LoadMore action={self.loadMore} />}
            </Cell>
        );
    }
}
