class Transaction extends React.Component {
    constructor(props) {
        super(props);

        this.iconAction = this.iconAction.bind(this);
        this.organize = this.organize.bind(this);
        this.setEnvelopeTitle = this.setEnvelopeTitle.bind(this);
        this.deleteTransaction = this.deleteTransaction.bind(this);
        this.restoreTransaction = this.restoreTransaction.bind(this);
 
        this.state = { showEnvelopes: false, envelope_id: this.props.envelope_id };
        this.state.unique = Cashular.Utils.makeid();

        this.setEnvelopeTitle();
    }

    setEnvelopeTitle() {
        var self = this;
        $.each(self.props.envelopes, function() {
            if (self.state.envelope_id === this.id) {
                self.state.envelope_title = this.title;
            }
        });
    }

    iconAction() {
        if (this.state.showEnvelopes) {
            this.setState({showEnvelopes: false});
        } else {
            this.setState({showEnvelopes: true});
        }
    }

    organize(envelope) {
        var self = this;

        Cashular.API.Transaction.organize(envelope.id, self.props.id)
        .success(function(transaction) {
            self.setState({envelope_id: transaction.envelope_id}, function() {
                self.props.afterOrganize();
                self.setEnvelopeTitle();
            });
        });

        self.setState({showEnvelopes: false});
    }

    deleteTransaction() {
        var self = this;

        Cashular.API.Transaction.destroy(this.props.id)
        .done(function() {
            self.props.transactionDeletedOrRestored();
        })
        .fail(function() {
            var snackbarContainer = document.querySelector('#snackbar-alerter');

            var data = {
                message: "Failed to delete transaction",
                timeout: 5000,
                actionText: 'Undo'
            };

            var snackbar = new MaterialSnackbar(snackbarContainer);
            snackbar.showSnackbar(data);
        });
    }

    restoreTransaction() {
        var self = this;

        Cashular.API.Transaction.restore(this.props.id)
        .done(function() {
            self.props.transactionDeletedOrRestored();
        })
        .fail(function() {
            var snackbarContainer = document.querySelector('#snackbar-alerter');

            var data = {
                message: "Failed to restore transaction",
                timeout: 5000,
                actionText: 'Undo'
            };

            var snackbar = new MaterialSnackbar(snackbarContainer);
            snackbar.showSnackbar(data);
        });
    }

    componentDidMount() {
        componentHandler.upgradeDom();
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
            icon = "playlist_add_check";
        } else {
            icon = "playlist_add";
        }

        return (
            <Grid>
            <Cell desktop="12" tablet="8" phone="4" className="transaction-cell">
                <Card className={"min-card " + color}>
                    <CardTitle>
                        {"$" + Math.abs(self.props.cost).toFixed(2)}
                    </CardTitle>
                    <CardText>
                        {self.props.description}
                        <div className="transaction-date">
                            {self.props.post_date}
                        </div>
                    </CardText>
                    <CardMenu>
                        {! self.props.deleted && typeof self.state.envelope_title !== "undefined" &&
                                self.state.envelope_title}
                        {! self.props.deleted &&
                            <Icon icon={icon} action={self.iconAction} />}
                    </CardMenu>
                    {! self.props.organizer &&
                        <CardActions>
                            {! self.props.deleted &&
                                <Icon icon="delete_forever" className="pull-right" action={self.deleteTransaction}></Icon>}
                            {self.props.deleted &&
                                <Icon icon="add" className="pull-right" action={self.restoreTransaction}></Icon>}
                        </CardActions>}
                </Card>
                {self.state.showEnvelopes &&
                    <EnvelopePicker action={self.organize}
                                    envelopes={self.props.envelopes}
                                    envelope_id={self.props.envelope_id} />
                }
            </Cell>
            </Grid>
        );
    }
}
