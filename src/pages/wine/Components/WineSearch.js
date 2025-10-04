import React from "react";
import { Form, Button, ListGroup, Badge } from "react-bootstrap";
import { BiSearch, BiTrash } from "react-icons/bi";

export function WineCount(props) {
    const 
    return(
        <Form.Group style={{ position: "relative", display: 'flex' }} className="mt-3 col-sm-10">
            <Form.Control
            type="text"
            id="searchFilter"
            placeholder="Search by any keyword..."
            value={searchQuery || ""}
            onChange={(e) => {
                const val = e.target.value;
                this.setState({ searchQuery: val.toLowerCase() }, () => this.updateSuggestions(val));
            }}
            // onFocus={(e) => this.updateSuggestions(e.target.value)}
            // onEnter
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                this.setState({suggestions: []});
                }
            }} 
            onSubmit={() => this.setState({suggestions: []})}
            />

            <Button onClick={() => this.setState({suggestions: []})} variant="outline-success">
                <BiSearch />
            </Button>
            <Button onClick={() => this.setState({ searchQuery: ""})} variant="outline-danger">
                <BiTrash />
            </Button>
            
            <ListGroup
            hidden={!this.state.searchQuery || this.state.suggestions.length === 0}
            variant="flush"
            style={{
                position: "absolute",
                zIndex: 1000,
                top: "100%",
                left: 0,
                right: 0,
                width: "100%"
            }}
            >
            {this.state.suggestions.slice(0, this.state.suggestionsLimit).map((s, idx) => (
                <ListGroup.Item
                action
                key={idx}
                onClick={() => this.setState({ searchQuery: s.toLowerCase(), suggestions: [] })}
                >
                <div className="d-flex justify-content-between align-items-center">
                    <span>{s}</span>
                    <Badge bg="primary" pill>{this.countMatchesForTerm(s)}</Badge>
                </div>
                </ListGroup.Item>
            ))}
            {this.state.suggestions.length > this.state.suggestionsLimit && (
                <ListGroup.Item
                action
                variant="light"
                onClick={() => this.setState({ suggestionsLimit: this.state.suggestionsLimit + 10 })}
                >
                Show more…
                </ListGroup.Item>
            )}
            {this.state.suggestionsLimit > 7 && (
                <ListGroup.Item
                action
                variant="light"
                onClick={() => this.setState({ suggestionsLimit: 7 })}
                >
                Show less
                </ListGroup.Item>
            )}
            </ListGroup>
            
        </Form.Group>
    )
}