class Explorer extends React.Component {
    constructor(props) {
        super(props);

        this.loadMore = this.loadMore.bind(this);
        this.load = this.load.bind(this);
        this.setEnvelope = this.setEnvelope.bind(this);
        this.resetAndLoad = this.resetAndLoad.bind(this);

        this.state = { pageSize: 10,
                       unique: Cashular.Utils.makeid() };

        if (this.props.envelopes.length > 0) {
            this.state.envelope = this.props.envelopes[0];
        }

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

        self.props.setTransactions({
            pageSize: self.state.pageSize,
            envelope: self.state.envelope
        });
    }

    resetAndLoad() {
        var self = this;
        self.setState({ pageSize: 10}, function() {
            self.load();
        });
    }

    setEnvelope(envelope) {
        var self = this;
        self.setState({envelope: envelope, pageSize: 10}, function() {
            self.load();
        })
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={3} tablet={0} phone={0}>
                </Cell> 
                <Cell desktop={5} tablet={5} phone={4} className="centered">
                    {typeof self.props.dateRange !== "undefined" && self.props.dateRange.title &&
                        <H6>{self.props.dateRange.title}</H6>}
                </Cell>
                <Cell desktop={4} tablet={3} phone={0}>
                </Cell> 

                <Cell desktop={3} tablet={0} phone={0}>
                </Cell>
                <Cell desktop={5} tablet={5} phone={4} className="centered">
                    {typeof self.props.transactionData.total !== "undefined" && self.props.transactionData.total !== 0 &&
                        <H6 className={((self.props.transactionData.total >= 0) ? "green-font" : "orange-font")}>
                            ${Math.abs(self.props.transactionData.total).toFixed(2)}</H6>}
                    {self.props.transactionData.transactions.map(function(transaction, index) {
                        return <Transaction cost={transaction.amount}
                                            description={transaction.description}
                                            key={transaction.id}
                                            id={transaction.id}
                                            envelope_id={transaction.envelope_id}
                                            envelopes={self.props.envelopes}
                                            afterOrganize={self.load} />
                    })}
                    {self.state.envelope && self.props.transactionData.count > self.state.pageSize &&
                        <LoadMore action={self.loadMore} />}
                </Cell>
                <Cell desktop={1} tablet={0} phone={0}>
                </Cell>
                <Cell desktop={0} tablet={0} phone={4} className="centered">
                    <H5>Select Envelope:</H5>
                </Cell>
                <Cell desktop={3} tablet={3} phone={4}>
                    <EnvelopePicker action={self.setEnvelope}
                                    envelopes={self.props.envelopes}
                                    envelope_id={self.state.envelope && self.state.envelope.id} />
                </Cell>
            </Grid>
        );
    }
}
