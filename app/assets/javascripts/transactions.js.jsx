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

        Cashular.Envelopes().all(function(envelopes) {
            var transactions = Cashular.Transactions().pageSize(self.state.pageSize);

            if (self.props.onlyUnorganized) {
                transactions.onlyUnorganized();
            }

            transactions.all(function(transactions) {
                self.setState({transactions: transactions,
                               envelopes: envelopes});
            });
        });
    }

    render() {
        var self = this;
        return (
            <Grid className="transaction-list">
                {self.state.transactions.map(function(transaction, index) {
                    return <Transaction cost={transaction.amount} description={transaction.description}
                                        key={transaction.id} id={transaction.id} envelope_id={transaction.envelope_id}
                                        envelopes={self.state.envelopes} afterOrganize={self.load} />
                })}
                <LoadMore action={self.loadMore} />
            </Grid>
        );
    }
}

class Transaction extends React.Component {
    constructor(props) {
        super(props);

        this.organize = this.organize.bind(this);
        this.iconAction = this.iconAction.bind(this);
 
        this.state = { showEnvelopes: false, envelope_id: this.props.envelope_id };
    }

    iconAction() {
        if (this.state.showEnvelopes) {
            this.setState({showEnvelopes: false});
        } else {
            this.setState({showEnvelopes: true});
        }
    }

    organize(envelopeId) {
        var self = this;

        return function() {
            $.post("/envelopes/"+envelopeId+"/add_transaction/"+self.props.id)
            .success(function(transaction) {
                self.setState({envelope_id: transaction.envelope_id}, function() {
                    self.props.afterOrganize();
                });
            });

            self.setState({showEnvelopes: false});
        };
    }

    render() {
        var self = this;

        var color;
        if (self.props.cost < 0) {
            color = "orange";
        } else {
            color = "green";
        }

        var icon;
        if (self.state.showEnvelopes) {
            icon = "remove";
        } else if (self.state.envelope_id) {
            icon = "check";
        } else {
            icon = "archive";
        }

        return (
            <Cell desktop="12">
                <Card className={"min-card " + color}>
                    <CardTitle>
                        {"$" + Math.abs(self.props.cost)}
                    </CardTitle>
                    <CardText>
                        {self.props.description}
                    </CardText>
                    <CardMenu>
                        <Icon icon={icon} action={self.iconAction} />
                    </CardMenu>
                </Card>
                {self.state.showEnvelopes &&
                    <List>
                        {self.props.envelopes.map(function(envelope, index) {
                            return <ListItem key={index} name={envelope.id} onChange={self.organize(envelope.id)}
                                             checked={self.state.envelope_id === envelope.id} title={envelope.title} icon="label" />
                        })}
                    </List>
                }
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
