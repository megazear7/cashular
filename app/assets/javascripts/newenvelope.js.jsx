class NewEnvelope extends React.Component {
    constructor(props) {
        super(props);

        this.createEnvelope = this.createEnvelope.bind(this);
    }

    createEnvelope(title) {
        var self = this;
        Cashular.API.Envelopes().create({title: title})
        .done(function() {
            self.props.onCreate();
        });
    }

    render() {
        return (
            <Cell desktop="3" tablet="4" phone="4">
                <TextField placeholder="Title of new Envelope" onSubmit={this.createEnvelope} name="newEnvelope" />
            </Cell>
        )
    }
}
