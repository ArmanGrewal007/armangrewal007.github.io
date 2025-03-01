import React, { useRef, useEffect } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Layout } from '@components';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import { getIconSvg } from '../utils';
import { get } from 'animejs';

const StyledTableContainer = styled.div`
  margin: 100px -20px;

  @media (max-width: 768px) {
    margin: 50px -10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    .hide-on-mobile {
      @media (max-width: 768px) {
        display: none;
      }
    }

    tbody tr {
      &:hover,
      &:focus {
        background-color: var(--light-navy);
      }
    }

    th,
    td {
      padding: 10px;
      text-align: left;

      &:first-child {
        padding-left: 20px;

        @media (max-width: 768px) {
          padding-left: 10px;
        }
      }
      &:last-child {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    tr {
      cursor: default;

      td:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
      }
      td:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }
    }

    td {
      &.year {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
          font-size: var(--fz-sm);
        }
      }

      &.title {
        padding-top: 15px;
        padding-right: 20px;
        color: var(--lightest-slate);
        font-size: var(--fz-xl);
        font-weight: 600;
        line-height: 1.25;
      }

      &.company {
        font-size: var(--fz-lg);
        white-space: nowrap;
      }

      &.tech {
        font-size: var(--fz-xxs);
        font-family: var(--font-mono);
        line-height: 1.5;
        .separator {
          margin: 5px 5px;
        }
        span {
          display: inline-block;
        }
      }

      &.links {
        min-width: 100px;

        div {
          display: flex;
          align-items: center;

          a {
            ${({ theme }) => theme.mixins.flexCenter};
            flex-shrink: 0;
          }

          a + a {
            margin-left: 10px;
          }
        }
      }
    }
  .year-divider {
    display: flex;
    align-items: center;
    text-align: center;
    width: 100%;
    position: relative;
    margin: 10px 0;
  }

  .year-divider::before,
  .year-divider::after {
    content: "";
    flex-grow: 1;
    height: 1px;
    background-color: var(--lightest-slate);
    margin: 0 10px;
  }
  }
`;

const ArchivePage = ({ location, data }) => {
  const allProjects = data.allMarkdownRemark.edges;
  const projects = allProjects.filter(({ node }) =>
    node.frontmatter.showInProjects === false);
  const revealTitle = useRef(null);
  const revealTable = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealTable.current, srConfig(200, 0));
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 10)));
  }, []);

  return (
    <Layout location={location}>
      <Helmet title="Archive" />

      <main>
        <header ref={revealTitle}>
          <h1 className="big-heading">Archive</h1>
          <p className="subtitle">{projects.length} certificates and counting ...</p>
        </header>

        <StyledTableContainer ref={revealTable}>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Title</th>
                <th className="hide-on-mobile">Issuer</th>
                <th className="hide-on-mobile">Tags</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 &&
                projects.map(({ node }, i) => {
                  const {
                    date,
                    github,
                    external,
                    title,
                    tech,
                    company,
                  } = node.frontmatter;
                  const year = new Date(date).getFullYear();
                  const prevYear = i > 0 ? new Date(projects[i - 1].node.frontmatter.date).getFullYear() : null;
                  return (
                    <>
                      {prevYear && prevYear !== year && (
                        <tr key={`hr-${i}`}>
                          <td colSpan="5">
                            <div className="year-divider">
                              <span className='overline'>{year}</span>
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr key={i} ref={el => (revealProjects.current[i] = el)}>
                        <td className="overline year">{`${new Date(date).getFullYear()}`}</td>

                        <td className="title">{title}</td>

                        <td className="company hide-on-mobile">
                          {company ? <span>{company}</span> : <span>—</span>}
                        </td>

                        <td className="tech hide-on-mobile">
                          {tech?.length > 0 &&
                            tech.map((item, i) => (
                              <span key={i}>
                                {getIconSvg(item)}{item}{''}
                                {i !== tech.length - 1 && <span className="separator">&middot;</span>}
                              </span>
                            ))}
                        </td>

                        <td className="links">
                          <div>
                            {external && (
                              <a href={external} aria-label="External Link">
                                <Icon name="External" />
                              </a>
                            )}
                            {github && (
                              <a href={github} aria-label="GitHub Link">
                                <Icon name="GitHub" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>
        </StyledTableContainer>
      </main>
    </Layout>
  );
};
ArchivePage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ArchivePage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/projects/" } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            date
            title
            tech
            github
            external
            company
            showInProjects
          }
          html
        }
      }
    }
  }
`;
