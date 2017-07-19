class LoadMore extends React.Component {
    render() {
        return (
            <Cell desktop={12} className="centered">
                <Button action={this.props.action}>
                    Load More
                </Button>
            </Cell>
        );
    }
}
