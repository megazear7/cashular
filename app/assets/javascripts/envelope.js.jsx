class Envelope extends React.Component {
    constructor(props) {
        super(props);

        this.state = { size: this.props.size || 3 };

        this.remove = this.remove.bind(this);
    }

    remove() {
        var self = this;
        Cashular.Envelopes().destroy(this.props.id)
        .done(function(destroyedItem) {
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
            <Cell desktop={this.state.size}>
                <Card className={"min-card " + color}>
                    {! this.props.dontShowAmount &&
                        <CardTitle>
                            ${Math.abs(this.props.amount).toFixed(2)}
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
