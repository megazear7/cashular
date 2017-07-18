class Transactions extends React.Component {
    constructor(props) {
        super(props);
        var self = this;
        self.state = { };

        this.loadMore = this.loadMore.bind(this);
        this.load = this.load.bind(this);

        self.state.daysAgo = 7;
        self.state.transactions = [ ];

        self.load();
    }

    loadMore() {
        var self = this;

        self.setState(function(prevState) {
            return { daysAgo: prevState.daysAgo + 7 };
        }, function() {
            self.load();
        });
    }

    load() {
        var self = this;

        Cashular.Transactions().daysAgo(self.state.daysAgo).all(function(transactions) {
            self.setState({transactions: transactions});
        });
    }

    render() {
        return (
            <Grid className="transaction-list">
                {this.state.transactions.map(function(transaction, index) {
                    return <Transaction cost={transaction.amount} description={transaction.description} key={index} /> })}
                <LoadMore action={this.loadMore} />
            </Grid>
        );
    }
}

class Transaction extends React.Component {
    render() {
        if (this.props.cost < 0) {
            type = "loss";
        } else {
            type = "gain";
        }

        return (
            <Cell desktop="12">
                <Card className={"transaction " + type}>
                    <CardTitle>
                        {"$" + this.props.cost}
                    </CardTitle>
                    <CardText>
                        {this.props.description}
                    </CardText>
                </Card>
            </Cell>
        );
    }
}

class LoadMore extends React.Component {
    render() {
        return (
            <Cell desktop={12} className="centered">
                <Button action={this.props.action}>
                    Load More
                </Button>
            </Cell>
        );
    }
}
