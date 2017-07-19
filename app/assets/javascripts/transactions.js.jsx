class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };

        this.loadMore = this.loadMore.bind(this);
        this.load = this.load.bind(this);

        this.state.daysAgo = 7;
        this.state.transactions = [ ];

        this.load();
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
            type = "orange";
        } else {
            type = "green";
        }

        return (
            <Cell desktop="12">
                <Card className={"min-card " + type}>
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
