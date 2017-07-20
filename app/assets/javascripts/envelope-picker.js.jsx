class EnvelopePicker extends React.Component {
    constructor(props) {
        super(props);

        this.setEnvelope = this.setEnvelope.bind(this);

        this.state = { unique: Cashular.Utils.makeid() };

        if (this.props.envelope_id) {
            this.state.envelope_id = this.props.envelope_id;
        }
    }

    setEnvelope(envelope) {
        var self = this;
        return function() {
            self.setState({envelope_id: envelope.id}, function() {
                self.props.action(envelope);
            });
        }
    }

    render() {
        var self = this;
        return (
            <List>
                {self.props.envelopes.map(function(envelope, index) {
                    return <ListItem key={self.state.unique+"-"+envelope.id}
                                     name={self.state.unique+"-"+envelope.id}
                                     listname={self.state.unique}
                                     onChange={self.setEnvelope(envelope)}
                                     checked={self.state.envelope_id === envelope.id}
                                     title={envelope.title}
                                     icon="email" />
                })}
            </List>
        );
    }
}
