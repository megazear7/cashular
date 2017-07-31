class Envelope extends React.Component {
    constructor(props) {
        super(props);

        this.state = { size: this.props.size || 3 };

        this.remove = this.remove.bind(this);
    }

    remove() {
        var self = this;

        var variables = {
            userId: 2,
            envelopeId: this.props.id
        };

        Cashular.Queries.DeleteEnvelope(variables, function() {
            self.props.onRemove();
        });
    }

    render() {
        var color;

        if (this.props.amount < 0) {
            color = "orange";
        } else {
            color = "green";
        }

        return (
            <Cell desktop={3} tablet={4} phone={4}>
                <Card className={"min-card " + color}>
                    {! this.props.dontShowAmount &&
                        <CardTitle>
                            ${Cashular.Utils.format(Math.abs(this.props.amount))}
                        </CardTitle>}
                    <CardText>
                        {this.props.title}
                    </CardText>
                    <CardMenu>
                        <LesserIcon icon="delete" action={this.remove} />
                    </CardMenu>
                </Card>
            </Cell>
        )
    }
}
