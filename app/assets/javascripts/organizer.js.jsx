class Organizer extends React.Component {
    render() {
        return (
            <Grid>
                <Cell desktop={3} tablet={1} phone={0}></Cell>
                <Cell desktop={5} tablet={6} phone={3} className="centered">
                    <H6>
                        {this.props.user.organizerTransactions.length > 0 &&
                            Cashular.Utils.prettyDate(new Date(this.props.user.organizerTransactions[0].post_date))}
                    </H6>
                </Cell>
                <Cell desktop={4} tablet={1} phone={1}></Cell>
                <Cell desktop={3} tablet={1} phone={0}></Cell>
                <Cell desktop={5} tablet={6} phone={4}>
                    <Transactions load={this.props.load}
                                  loadMore={this.props.loadMore}
                                  page={this.props.organizerPage}
                                  count={this.props.user.organizerTransactionCount}
                                  transactions={this.props.user.organizerTransactions}
                                  envelopes={this.props.user.envelopes} />
                </Cell>
                <Cell desktop={4} tablet={1} phone={0}></Cell>
            </Grid>
        );
    }
}
