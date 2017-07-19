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

        Cashular.Envelopes().all(function(envelopes) {
            Cashular.Transactions().daysAgo(self.state.daysAgo).all(function(transactions) {
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
                                        key={index} id={transaction.id} envelope_id={transaction.envelope_id}
                                        envelopes={self.state.envelopes} />
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
                console.log(transaction);
                self.setState({envelope_id: transaction.envelope_id});
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
        if (self.state.envelope_id) {
            icon = "check";
        } else if (self.state.showEnvelopes) {
            icon = "remove";
        } else {
            icon = "archive";

        }

        return (
            <Cell desktop="12">
                <Card className={"min-card " + type}>
                    <CardTitle>
                        {"$" + self.props.cost}
                    </CardTitle>
                    <CardText>
                        {self.props.description}
                    </CardText>
                    <CardMenu>
                        <Icon icon={icon} action={self.iconAction} />
                    </CardMenu>
                </Card>
                {self.state.showEnvelopes &&
                    <ul className="demo-list-control mdl-list">
                        {self.props.envelopes.map(function(envelope, index) {
                            return <li className="mdl-list__item" key={index}>
                                       <span className="mdl-list__item-primary-content">
                                           <i className="material-icons  mdl-list__item-avatar">person</i>
                                           {envelope.title}
                                       </span>
                                       <span className="mdl-list__item-secondary-action">
                                           <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={"list-option-"+envelope.id}>
                                               <input type="radio" id={"list-option-"+envelope.id} className="mdl-radio__button"
                                                      name="options" value={envelope.id} onChange={self.organize(envelope.id)}
                                                      checked={self.state.envelope_id === envelope.id} />
                                           </label>
                                       </span>
                                   </li>
                        })}
                    </ul>
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
