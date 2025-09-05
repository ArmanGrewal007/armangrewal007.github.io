import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import { getIconSvg } from '../../utils';

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }

  .tech-filter {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 20px;
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    
    input[type="checkbox"] {
      accent-color: var(--green);
    }
    
    input[type="checkbox"]:checked + span {
      color: var(--green);
    }
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: 1fr; /* Default: 1 column for mobile */
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 767px) { /* Phones */
      grid-template-columns: 1fr;
    }

    @media (min-width: 768px) and (max-width: 1080px) { /* Tablets */
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1081px) { /* Desktops */
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .project-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: auto;
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 35px;

    .folder {
      color: var(--green);
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .project-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .project-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .project-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .project-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }

  .project-tech-item {
    display: flex;
    align-items: center; 
  }

  .project-company {
    color: var(--green); /* Or any color from your theme */
    font-size: var(--fz-sm); /* Adjust as needed */
    margin-bottom: 10px; /* Space below the company text */
  }
`;

const Projects = () => {
  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/projects/" }
          frontmatter: { showInProjects: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
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

  const [showMore, setShowMore] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const revealTechFilters = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealTechFilters.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 6;
  const projects = data.projects.edges.filter(({ node }) => node);
  const techCount = projects.reduce((acc, { node }) => {
    const techs = node.frontmatter.tech || [];
    techs.forEach(t => { acc[t] = (acc[t] || 0) + 1; });
    return acc;
  }, {});

  const sortedTechs = Array.from(new Set(projects.flatMap(({ node }) => node.frontmatter.tech || [])))
    .sort((a, b) => techCount[b] - techCount[a]);

  const handleCheckboxChange = (tech) => {
    setSelectedTechs(prev =>
      prev.includes(tech)
        ? prev.filter(item => item !== tech)
        : [...prev, tech]
    );
  };

  // const firstSix = projects.slice(0, GRID_LIMIT);
  // const projectsToShow = showMore ? projects : firstSix;
  const filteredProjects = projects.filter(({ node }) => {
    if (!selectedTechs.length) return true;
    return selectedTechs.some(tech => node.frontmatter.tech.includes(tech));
  });
  const firstSix = filteredProjects.slice(0, GRID_LIMIT);
  const projectsToShow = showMore ? filteredProjects : firstSix;


  const projectInner = node => {
    const { frontmatter, html } = node;
    const { github, external, title, tech, company } = frontmatter;

    return (
      <div className="project-inner">
        <header>
          <div className="project-top">
            <div className="folder">
              <Icon name="Folder" />
            </div>
            <div className="project-links">
              {github && (
                <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                  <Icon name="GitHub" />
                </a>
              )}
              {external && (
                <a
                  href={external}
                  aria-label="External Link"
                  className="external"
                  target="_blank"
                  rel="noreferrer">
                  <Icon name="External" />
                </a>
              )}
            </div>
          </div>

          <h3 className="project-title">
            <a href={external} target="_blank" rel="noreferrer">
              {title}
            </a>
          </h3>

          {company && <p className="project-company">{company}</p>}

          <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />
        </header>

        <footer>
          {tech && (
            <ul className="project-tech-list">
              {tech.map((tech, i) => (
                <li key={i} className="project-tech-item">
                  {getIconSvg(tech)}{tech}
                </li>
              ))}
            </ul>
          )}
        </footer>
      </div>
    );
  };

  return (
    <StyledProjectsSection>
      <h2 ref={revealTitle}>Projects</h2>

      <div className="tech-filter">
        {sortedTechs.map((tech, index) => (
          <label
            key={index}
            ref={el => (revealTechFilters.current[index] = el)}
            style={{ marginRight: '1rem' }}>
            <input
              type="checkbox"
              value={tech}
              checked={selectedTechs.includes(tech)}
              onChange={() => handleCheckboxChange(tech)}
            />
            <span>{tech} ({techCount[tech]})</span>
          </label>
        ))}
      </div>

      <ul className="projects-grid">
        {prefersReducedMotion ? (
          <>
            {projectsToShow &&
              projectsToShow.map(({ node }, i) => (
                <StyledProject key={i}>{projectInner(node)}</StyledProject>
              ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {projectsToShow &&
              projectsToShow.map(({ node }, i) => (
                <CSSTransition
                  key={i}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <StyledProject
                    key={i}
                    ref={el => (revealProjects.current[i] = el)}
                    style={{
                      transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                    }}>
                    {projectInner(node)}
                  </StyledProject>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </ul>

      {filteredProjects.length > GRID_LIMIT && (
        <button className="more-button" onClick={() => setShowMore(!showMore)}>
          Show {showMore ? 'Less' : 'More'}
        </button>
      )}
    </StyledProjectsSection>
  );
};

export default Projects;
