class Transaction extends React.Component {
    constructor(props) {
        super(props);

        this.iconAction = this.iconAction.bind(this);
        this.organize = this.organize.bind(this);
        this.setEnvelopeTitle = this.setEnvelopeTitle.bind(this);
 
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

        $.post("/envelopes/"+envelope.id+"/add_transaction/"+self.props.id)
        .success(function(transaction) {
            self.setState({envelope_id: transaction.envelope_id}, function() {
                self.props.afterOrganize();
                self.setEnvelopeTitle();
            });
        });

        self.setState({showEnvelopes: false});
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
            <Cell desktop="12">
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
                        {typeof this.state.envelope_title !== "undefined" &&
                            this.state.envelope_title}
                        <Icon icon={icon} action={self.iconAction} />
                    </CardMenu>
                </Card>
                {self.state.showEnvelopes &&
                    <EnvelopePicker action={self.organize}
                                    envelopes={self.props.envelopes}
                                    envelope_id={self.props.envelope_id} />
                }
            </Cell>
        );
    }
}
