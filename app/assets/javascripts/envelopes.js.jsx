class Envelopes extends React.Component {
    constructor(props) {
        super(props);

        this.load = this.load.bind(this);

        this.state = { };
        this.state.envelopes = [ ];

        this.state.type = "previous_week";

        this.load();
    }

    load() {
        var self = this;

        var envelopes = Cashular.Envelopes()
            
        if (self.state.type === "previous_week") {
            envelopes.daysAgo(7);
        } else if (self.state.type === "previous_month") {
            envelopes.daysAgo(30);
        } else if (self.state.type === "previous_year") {
            envelopes.daysAgo(365);
        }
            
        envelopes.all(function(envelopes) {
            self.setState({envelopes: envelopes}, function() {
                self.props.newEnvelope();
            });
        });
    }

    types() {
        return [{title: "Previous Week", key: "previous_week"},
                {title: "Previous Month", key: "previous_month"},
                {title: "Previous Year", key: "previous_year"},
                {title: "All Time", key: "all_time"}];
    }

    changeType(type) {
        var self = this;
        return function() {
            self.setState({type: type}, function() {
                self.load();
            });
        };
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={3}>
                    <List>
                        {self.types().map(function(type, index) {
                            return <ListItem key={type.key} name={type.key} onChange={self.changeType(type.key)}
                                             checked={self.state.type === type.key} title={type.title} icon="restore" />
                        })}
                    </List>
                </Cell>
                <Cell desktop={9}>
                    <Grid>
                        {self.state.envelopes.map(function(envelope, index) {
                            if (envelope.sum !== 0) {
                                return <Envelope amount={envelope.sum} title={envelope.title}
                                                 key={index} onRemove={self.load} id={envelope.id} /> }})}
                        <NewEnvelope onCreate={self.load} />
                    </Grid>
                </Cell>
                <Cell desktop={3}>
                </Cell>
                <Cell desktop={9}>
                    <hr />
                    <p>Empty Envelopes</p>
                </Cell>
                <Cell desktop={3}>
                </Cell>
                <Cell desktop={9}>
                    <Grid>
                        {self.state.envelopes.map(function(envelope, index) {
                            if (envelope.sum === 0) {
                                return <Envelope amount={envelope.sum} title={envelope.title} dontShowAmount={true}
                                                 key={index} onRemove={self.load} id={envelope.id} /> }})}
                    </Grid>
                </Cell>
            </Grid>
        );
    }
}
