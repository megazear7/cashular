class Explorer extends React.Component {
    constructor(props) {
        super(props);

        this.loadMore = this.loadMore.bind(this);
        this.load = this.load.bind(this);
        this.setEnvelope = this.setEnvelope.bind(this);
        this.resetAndLoad = this.resetAndLoad.bind(this);

        this.state = { transactions: [ ],
                       pageSize: 10,
                       dateRange: {title: "Previous Week", key: "previous_week", daysAgo: 7},
                       unique: Cashular.Utils.makeid() };

        if (this.props.envelopes.length > 0) {
            this.state.envelope = this.props.envelopes[0];
        }
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

        if (typeof this.state.dateRange !== "undefined") {
            if (typeof this.state.dateRange.daysAgo !== "undefined") {
                transactions.daysAgo(this.state.dateRange.daysAgo);
            } else if (this.state.dateRange.from !== "undefined") {
                transactions.from(this.state.dateRange.from).to(this.state.dateRange.to);
            }
        }

        transactions.fromEnvelope(self.state.envelope.id).all(function(response) {
            self.setState({transactions: response.transactions,
                           count: response.count,
                           total: response.total});
        });
    }

    resetAndLoad(dateRange) {
        var self = this;
        self.setState({dateRange: dateRange, pageSize: 10}, function() {
            self.load();
        });
    }

    setEnvelope(envelope) {
        var self = this;
        self.setState({envelope: envelope, pageSize: 10}, function() {
            self.load();
        });
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={3}>
                    <Grid>
                        {self.state.envelope &&
                            <TimeSelector onChange={self.resetAndLoad} />}
                    </Grid>
                </Cell>
                <Cell desktop={1} />
                <Cell desktop={3} className="centered">
                    {typeof self.state.total !== "undefined" && self.state.total !== 0 &&
                        <H6>Total: {self.state.total}</H6>}
                    <Grid className="transaction-list">
                        {self.state.transactions.map(function(transaction, index) {
                            return <Transaction cost={transaction.amount}
                                                description={transaction.description}
                                                key={transaction.id}
                                                id={transaction.id}
                                                envelope_id={transaction.envelope_id}
                                                envelopes={self.props.envelopes}
                                                afterOrganize={self.resetAndLoad} />
                        })}
                        {self.state.envelope && self.state.count > self.state.pageSize &&
                            <LoadMore action={self.loadMore} />}
                    </Grid>
                </Cell>
                <Cell desktop={1} />
                <Cell desktop={3}>
                    <EnvelopePicker action={self.setEnvelope}
                                    envelopes={self.props.envelopes}
                                    envelope_id={self.state.envelope && self.state.envelope.id} />
                </Cell>
            </Grid>
        );
    }
}
