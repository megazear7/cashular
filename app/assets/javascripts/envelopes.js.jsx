class Envelopes extends React.Component {
    constructor(props) {
        super(props);

        this.load = this.load.bind(this);

        this.state = { envelopes: [ ],
                       unique: Cashular.Utils.makeid() };

        this.load({title: "Previous Week", key: "previous_week", daysAgo: 7});
    }

    load(type) {
        var self = this;

        var envelopes = Cashular.Envelopes()
        var unallocated = Cashular.Transactions()
            
        if (typeof type !== "undefined") {
            if (typeof type.daysAgo !== "undefined") {
                envelopes.daysAgo(type.daysAgo);
                unallocated.daysAgo(type.daysAgo);
            } else if (type.from !== "undefined") {
                envelopes.from(type.from).to(type.to);
                unallocated.from(type.from).to(type.to);
            }
        }

        envelopes.all(function(envelopes) {
            self.setState({envelopes: envelopes}, function() {
                self.props.addOrRemoved(self.state.envelopes);
            });
        });

        unallocated.unallocated()
        .done(function(response) {
            self.setState({unallocated: response.transactions});
        });
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={3}>
                    <Grid>
                        <TimeSelector onChange={this.load} />
                    </Grid>
                </Cell>
                <Cell desktop={9}>
                    <Grid>
                        {self.state.envelopes.map(function(envelope, index) {
                            if (envelope.sum !== 0) {
                                return <Envelope amount={envelope.sum}
                                                 title={envelope.title}
                                                 key={index}
                                                 onRemove={self.load}
                                                 id={envelope.id} /> }})}
                        <NewEnvelope onCreate={self.load} />
                        <Cell desktop={12}>
                            <hr />
                        </Cell>
                        <Cell desktop={8}>
                            <H6>Empty Envelopes</H6>
                            <Grid>
                                {self.state.envelopes.map(function(envelope, index) {
                                    if (envelope.sum === 0) {
                                        return <Envelope amount={envelope.sum}
                                                         title={envelope.title}
                                                         dontShowAmount={true}
                                                         key={index}
                                                         onRemove={self.load}
                                                         id={envelope.id}
                                                         size={4} /> }})}
                            </Grid>
                        </Cell>
                        <Cell desktop={4}>
                            {typeof self.state.unallocated !== "undefined" && (self.state.unallocated.payments > 0 || self.state.unallocated.recieved > 0) &&
                                <Grid>
                                    <Cell desktop={12}>
                                        <H6>Unallocated</H6>
                                        {self.state.unallocated.payments > 0 &&
                                            <p>Payments: ${self.state.unallocated.payments.toFixed(2)}</p>}
                                        {self.state.unallocated.recieved > 0 &&
                                            <p>Recieved: ${self.state.unallocated.recieved.toFixed(2)}</p>}
                                    </Cell>
                                </Grid>}
                        </Cell>
                    </Grid>
                </Cell>
            </Grid>
        );
    }
}
