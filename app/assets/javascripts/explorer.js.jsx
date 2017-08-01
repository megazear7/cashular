class Explorer extends React.Component {
    render() {
        return (
            <Grid>
                <Cell desktop={3} tablet={0} phone={0}></Cell> 
                <Cell desktop={5} tablet={5} phone={4} className="centered">
                    {typeof this.props.dateRange !== "undefined" && this.props.dateRange.title &&
                        <H6>{this.props.dateRange.title}</H6>}
                </Cell>
                <Cell desktop={4} tablet={3} phone={0}></Cell> 
                <Cell desktop={3} tablet={0} phone={0}></Cell>
                <Cell desktop={5} tablet={5} phone={4} className="centered">
                    <Transactions load={this.props.load}
                                  loadMore={this.props.explorerLoadMore}
                                  count={this.props.explorerEnvelope.count}
                                  transactions={this.props.explorerEnvelope.transactions}
                                  envelopes={this.props.user.envelopes} />
                </Cell>
                <Cell desktop={1} tablet={0} phone={0}></Cell>
                <Cell desktop={0} tablet={0} phone={4} className="centered">
                    <H5>Select Envelope:</H5>
                </Cell>
                <Cell desktop={3} tablet={3} phone={4}>
                    <EnvelopePicker action={this.props.setExplorerEnvelope}
                                    envelopes={this.props.user.envelopes}
                                    envelope_id={this.props.explorerEnvelope && this.props.explorerEnvelope.id} />
                </Cell>
            </Grid>
        );
    }
}
