class Transaction extends React.Component {
    constructor(props) {
        super(props);

        this.organize = this.organize.bind(this);
        this.iconAction = this.iconAction.bind(this);
 
        this.state = { showEnvelopes: false, envelope_id: this.props.envelope_id };

        var self = this;
        $.each(this.props.envelopes, function() {
            if (self.props.envelope_id === this.id) {
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
            icon = "playlist_add_check";
        } else {
            icon = "playlist_add";
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
                        {icon === "playlist_add_check" && this.state.envelope_title}
                        <Icon icon={icon} action={self.iconAction} />
                    </CardMenu>
                </Card>
                {self.state.showEnvelopes &&
                    <List>
                        {self.props.envelopes.map(function(envelope, index) {
                            return <ListItem key={index} name={envelope.id} onChange={self.organize(envelope.id)}
                                             checked={self.state.envelope_id === envelope.id} title={envelope.title} icon="email" />
                        })}
                    </List>
                }
            </Cell>
        );
    }
}
