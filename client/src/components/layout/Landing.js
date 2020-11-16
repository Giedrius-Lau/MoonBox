import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";

const Landing = ({ isAuthenticated }) => {
	const props = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 500, });
    const propsSubtitle = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 1000, });
	
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <section className="landing">
            <div className="dark-overlay">
                <div className="landing-inner">
                    <animated.h1 className="x-large" style={props}>Developer Connector</animated.h1>
                    <animated.p className="lead" style={propsSubtitle}>
                        Create a developer profile/portfolio, share posts and get help from other developers
                    </animated.p>
                    <div className="buttons">
                        <Link to="/register" className="btn btn-primary">
                            Join
                        </Link>
                        <Link to="/login" className="btn btn-light">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

Landing.propTypes = {
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
