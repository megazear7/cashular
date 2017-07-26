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

        self.props.setTransactions({
            pageSize: self.state.pageSize,
            showingNonDeleted: self.state.showingNonDeleted
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

    resetAndLoad() {
        var self = this;
        self.setState({ pageSize: 10 }, function() {
            self.load();
        });
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={3} tablet={1} phone={0}>
                </Cell>
                <Cell desktop={5} tablet={6} phone={3} className="centered">
                    <H6>
                        {self.props.transactions.length > 0 && self.state.showingNonDeleted &&
                            Cashular.Utils.prettyDate(new Date(self.props.transactions[0].post_date))}
                        {self.props.transactions.length > 0 && ! self.state.showingNonDeleted &&
                            "Deleted Transactions"}
                    </H6>
                </Cell>
                <Cell desktop={4} tablet={1} phone={1}>
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
                <Cell desktop={3} tablet={1} phone={0}>
                </Cell>
                <Cell desktop={5} tablet={6} phone={4}>
                    {self.props.transactions.map(function(transaction, index) {
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
                                            afterOrganize={self.load} />
                    })}
                    {self.state.count > self.state.pageSize &&
                        <LoadMore action={self.loadMore} />}
                </Cell>
                <Cell desktop={4} tablet={1} phone={0}>
                </Cell>
            </Grid>
        );
    }
}
