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

        console.log("B");

        Cashular.Envelopes().all(function(envelopes) {
            var transactions = Cashular.Transactions().daysAgo(self.state.daysAgo);

            if (self.props.onlyUnorganized) {
                transactions.onlyUnorganized();
            }

            transactions.all(function(transactions) {
                console.log("C");

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

        if (self.props.cost < 0) {
            type = "orange";
        } else {
            type = "green";
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
                <Card className={"min-card " + type}>
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
                            return <ListItem className="mdl-list__item" key={index} name={envelope.id} onChange={self.organize(envelope.id)}
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
