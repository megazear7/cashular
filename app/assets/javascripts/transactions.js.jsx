class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };

        this.loadMore = this.loadMore.bind(this);
        this.load = this.load.bind(this);
        this.resetAndLoad = this.resetAndLoad.bind(this);

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

        var transactions = Cashular.Transactions();

        if (self.props.onlyUnorganized) {
            transactions.onlyUnorganized();
        }

        if (typeof self.state.dateRange !== "undefined") {
            if (typeof self.state.dateRange.daysAgo !== "undefined") {
                transactions.daysAgo(self.state.dateRange.daysAgo);
            } else if (self.state.dateRange.from !== "undefined") {
                transactions.from(self.state.dateRange.from).to(self.state.dateRange.to);
            }
        }

        transactions.pageSize(self.state.pageSize)

        transactions.all(function(response) {
            self.setState({transactions: response.transactions,
                           count: response.count,
                           envelopes: self.props.envelopes});
        });
    }

    resetAndLoad(dateRange) {
        var self = this;
        self.setState({ pageSize: 10, dateRange: dateRange }, function() {
            self.load();
        });
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={3}>
                    <Grid>
                        <TimeSelector onChange={self.resetAndLoad} initial={{title: "All Time", key: "all_time"}} />
                    </Grid>
                </Cell>
                <Cell desktop={1}>
                </Cell>
                <Cell desktop={4}>
                    {self.state.transactions.length > 0 &&
                        <Cell className="centered" desktop={12}>
                            <H6>{Cashular.Utils.prettyDate(new Date(self.state.transactions[0].post_date))}</H6>
                        </Cell>}
                    {self.state.transactions.map(function(transaction, index) {
                        return <Transaction cost={transaction.amount}
                                            description={transaction.description}
                                            key={transaction.id}
                                            id={transaction.id}
                                            envelope_id={transaction.envelope_id}
                                            envelopes={self.props.envelopes}
                                            afterOrganize={self.resetAndLoad} />
                    })}
                    {self.state.count > self.state.pageSize &&
                        <LoadMore action={self.loadMore} />}
                </Cell>
                <Cell desktop={4}>
                </Cell>
            </Grid>
        );
    }
}

