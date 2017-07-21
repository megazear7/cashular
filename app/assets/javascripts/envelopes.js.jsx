class Envelopes extends React.Component {
    constructor(props) {
        super(props);

        this.load = this.load.bind(this);
        this.perTimePeriod = this.perTimePeriod.bind(this);
        this.setTimePeriod = this.setTimePeriod.bind(this);

        this.state = { envelopes: [ ],
                       unique: Cashular.Utils.makeid() };

        this.load({title: "Previous Week", key: "previous_week", daysAgo: 7});
    }

    load(dateRange) {
        var self = this;

        var envelopes = Cashular.Envelopes()
        var unallocated = Cashular.Transactions()
            
        if (typeof dateRange !== "undefined") {
            if (typeof dateRange.daysAgo !== "undefined") {
                envelopes.daysAgo(dateRange.daysAgo);
                unallocated.daysAgo(dateRange.daysAgo);
            } else if (dateRange.from !== "undefined") {
                envelopes.from(dateRange.from).to(dateRange.to);
                unallocated.from(dateRange.from).to(dateRange.to);
            }
        }

        envelopes.all(function(envelopes) {
            self.setState({envelopes: envelopes, dateRange: dateRange}, function() {
                self.props.addOrRemoved(self.state.envelopes);
                if (self.radio1) {
                    componentHandler.upgradeElement(self.radio1);
                }
                if (self.radio2) {
                    componentHandler.upgradeElement(self.radio2);
                }
                if (self.radio3) {
                    componentHandler.upgradeElement(self.radio3);
                }
            });
        });

        unallocated.unallocated()
        .done(function(response) {
            self.setState({unallocated: response});
        });
    }

    perTimePeriod(amount) {
        if (typeof this.state.dateRange !== "undefined" &&
                typeof this.state.timePeriod !== "undefined" &&
                this.state.dateRange[this.state.timePeriod]) {
            return amount / this.state.dateRange[this.state.timePeriod];
        } else {
            return amount;
        }
    }

    setTimePeriod(timePeriod) {
        this.setState({timePeriod: timePeriod});
    }

    render() {
        var self = this;
        return (
            <Grid>
                <Cell desktop={3}>
                    <Grid>
                        <TimeSelector onChange={self.load} />
                    </Grid>
                </Cell>
                <Cell desktop={9}>
                    <Grid>
                        <Cell desktop={10} className="centered">
                            {typeof self.state.dateRange !== "undefined" && self.state.dateRange.title &&
                                <H6>{self.state.dateRange.title}</H6>}
                        </Cell>
                        <Cell desktop={2}>
                            <PeriodSelector onChange={self.setTimePeriod} dateRange={self.state.dateRange} />
                        </Cell>
                        {self.state.envelopes.map(function(envelope, index) {
                            if (envelope.sum !== 0) {
                                return <Envelope amount={self.perTimePeriod(envelope.sum)}
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
                                            <p>Payments: ${Cashular.Utils.format(self.state.unallocated.payments)}</p>}
                                        {self.state.unallocated.recieved > 0 &&
                                            <p>Recieved: ${Cashular.Utils.format(self.state.unallocated.recieved)}</p>}
                                    </Cell>
                                </Grid>}
                        </Cell>
                    </Grid>
                </Cell>
            </Grid>
        );
    }
}
