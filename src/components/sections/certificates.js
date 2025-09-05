import React, { useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import { getIconSvg } from '@utils';

const StyledCertificatesSection = styled.section`
  max-width: 1000px;
  margin: 0 auto;

  .inner {
    display: flex;
    flex-direction: column;
  }

  header {
    margin-bottom: 40px;
    text-align: center;

    h2 {
      font-size: clamp(24px, 5vw, var(--fz-heading));
      margin-bottom: 10px;
    }

    .subtitle {
      color: var(--green);
      margin: 0 0 20px 0;
      font-size: var(--fz-md);
      font-family: var(--font-mono);
      font-weight: 400;
      line-height: 1.5;
    }

    .archive-link {
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      &:after {
        bottom: 0.1em;
      }
    }
  }
`;

const StyledTableContainer = styled.div`
  margin: 0px 0 5px 0;

  @media (max-width: 768px) {
    margin: 15px 0 25px 0;
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

      &:last-child {
        text-align: right;
      }

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
        text-align: right;

        div {
          display: flex;
          align-items: center;
          justify-content: flex-end;

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
  }
`;

const StyledMoreButton = styled(Link)`
  ${({ theme }) => theme.mixins.button};
  margin: 30px auto 0;
  display: block;
  text-align: center;
`;

const Certificates = () => {
  const data = useStaticQuery(graphql`
    query {
      certificates: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/certificates/" }
        }
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
            }
            html
          }
        }
      }
    }
  `);

  const revealTitle = useRef(null);
  const revealSubtitle = useRef(null);
  const revealTable = useRef(null);
  const revealEllipsisIndicator = useRef(null);
  const revealArchiveLink = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealSubtitle.current, srConfig(100));
    sr.reveal(revealTable.current, srConfig(200));
    sr.reveal(revealEllipsisIndicator.current, srConfig(250));
    sr.reveal(revealArchiveLink.current, srConfig(300));
  }, []);

  const DISPLAY_LIMIT = 4;
  const certificates = data.certificates.edges.filter(({ node }) => node);
  const recentCertificates = certificates.slice(0, DISPLAY_LIMIT);

  return (
    <StyledCertificatesSection id="certificates">
      <div className="inner">
        <header>
          <h2 ref={revealTitle}>Certificates</h2>
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
            {recentCertificates.length > 0 &&
              recentCertificates.map(({ node }, i) => {
                const { date, github, external, title, tech, company } = node.frontmatter;
                return (
                  <tr key={i}>
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
                          <a href={external} aria-label="External Link" target="_blank" rel="noreferrer">
                            <Icon name="External" />
                          </a>
                        )}
                        {github && (
                          <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                            <Icon name="GitHub" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </StyledTableContainer>

        <div align="center" style={{ marginTop: '15px' }} ref={revealEllipsisIndicator}>
          <span style={{ fontSize: '32px', fontWeight: 'bolder', lineHeight: '1' }}>⋮</span>
        </div>
        
        <StyledMoreButton 
          className="archive-link" 
          as="a"
          href="/archive" 
          target="_blank"
          rel="noopener noreferrer"
          ref={revealArchiveLink}
        >
          Show other {certificates.length - DISPLAY_LIMIT} certificates...
        </StyledMoreButton>
      </div>
    </StyledCertificatesSection>
  );
};

export default Certificates;