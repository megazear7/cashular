class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };

        this.loadMore = this.loadMore.bind(this);
        this.load = this.load.bind(this);
        this.resetAndLoad = this.resetAndLoad.bind(this);
        this.showDeleted = this.showDeleted.bind(this);

        this.state.unique = Cashular.Utils.makeid();
        this.state.pageSize = 10;
        this.state.transactions = [ ];
        this.state.showingNonDeleted = true;

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

        if (typeof self.state.dateRange !== "undefined") {
            if (typeof self.state.dateRange.daysAgo !== "undefined") {
                transactions.daysAgo(self.state.dateRange.daysAgo);
            } else if (self.state.dateRange.from !== "undefined") {
                transactions.from(self.state.dateRange.from).to(self.state.dateRange.to);
            }
        }

        if (typeof self.state.showingNonDeleted !== "undefined" && ! self.state.showingNonDeleted) {
            transactions.retrieveDeleted();
        }

        transactions.all(function(response) {
            self.setState({transactions: response.transactions,
                           count: response.count,
                           envelopes: self.props.envelopes});
        });
    }

    showDeleted(e) {
        var self = this;

        self.setState(function(prevState) {
            return { showingNonDeleted: ! prevState.showingNonDeleted };
        }, function() {
            self.load();
        });
    }

    resetAndLoad(dateRange) {
        var self = this;
        self.setState({ pageSize: 10, dateRange: dateRange }, function() {
            self.load();
        });
    }

    componentDidMount() {
        componentHandler.upgradeDom();
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
                    <Grid>
                        <Cell className="centered" desktop={12}>
                            <H6>
                                {self.state.transactions.length > 0 && self.state.showingNonDeleted &&
                                    Cashular.Utils.prettyDate(new Date(self.state.transactions[0].post_date))}
                                {self.state.transactions.length > 0 && ! self.state.showingNonDeleted &&
                                    "Deleted Transactions"}
                            </H6>
                        </Cell>
                    </Grid>
                    {self.state.transactions.map(function(transaction, index) {
                        return <Transaction cost={transaction.amount}
                                            post_date={transaction.post_date}
                                            description={transaction.description}
                                            key={transaction.id}
                                            id={transaction.id}
                                            organizer={self.props.onlyUnorganized}
                                            deleted={transaction.deleted}
                                            envelope_id={transaction.envelope_id}
                                            transactionDeletedOrRestored={self.load}
                                            envelopes={self.props.envelopes}
                                            afterOrganize={self.resetAndLoad} />
                    })}
                    {self.state.count > self.state.pageSize &&
                        <LoadMore action={self.loadMore} />}
                </Cell>
                <Cell desktop={4}>
                    <label className="mdl-switch mdl-js-switch mdl-js-ripple-effect transaction-switch"
                           htmlFor={self.state.unique+"-show-non-deleted"}
                           ref={(el) => { self.deletedSwitch = el}}>
                        <input type="checkbox"
                               id={self.state.unique+"-show-non-deleted"}
                               className="mdl-switch__input"
                               defaultChecked={self.state.showingNonDeleted}
                               onChange={self.showDeleted} />
                        <span className="mdl-switch__label"></span>
                    </label>
                </Cell>
            </Grid>
        );
    }
}

