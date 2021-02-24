import { Image, Transformation } from 'cloudinary-react';
import { controlTypes } from '../pages/resume';

export default function ResumePreview({
    documentRef,
    title,
    email,
    address,
    telephone,
    sections,
    bioSections,
    skills,
    imageId,
    name,
    styles,
}) {
    const sectionsByTypeMap = new Map();
    sections?.forEach((section) => {
        if (sectionsByTypeMap.has(section.type)) {
            const current = sectionsByTypeMap.get(section.type);
            sectionsByTypeMap.set(section.type, [section, ...current]);
        } else {
            sectionsByTypeMap.set(section.type, [section]);
        }
    });

    const sectionsByTypeArray = Array.from(sectionsByTypeMap);

    return (
        <div className={styles.container}>
            <div className={styles.background} style={{ width: '210mm' }} ref={documentRef}>
                <header className={styles.header}>
                    <h1 className={styles.headerTitle}>
                        {name} ({title})
                    </h1>
                    <div className={styles.headerContent}>
                        <section className={styles.headerPersonalInfoContainer}>
                            <ul>
                                <li>
                                    <a href={`mailto: ${email}`}>{email}</a>
                                </li>
                                <li>
                                    <a href={`tel:+${telephone}`}>{telephone}</a>
                                </li>
                                <li>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{address}</p>
                                </li>
                            </ul>
                        </section>
                        <section className={styles.headerListSection}>
                            {bioSections?.map((bioSection) => (
                                <ul>
                                    <li>
                                        {bioSection.title} : {bioSection.label}
                                    </li>
                                </ul>
                            ))}
                        </section>
                        <Image className={styles.headerImage} publicId={imageId}>
                            <Transformation width="200" height="200" gravity="faces" crop="fill" />
                        </Image>
                    </div>
                </header>

                <div className={styles.skillsContainer}>
                    <h1>Skills</h1>
                    {skills?.map((skill) => (
                        <ul>
                            <li dangerouslySetInnerHTML={{ __html: skill.content }} />
                        </ul>
                    ))}
                </div>

                {sectionsByTypeArray.map((sections) => {
                    return (
                        <>
                            <h1>{sections[0]}</h1>
                            <SectionList styles={styles} sections={sections[1]} />
                        </>
                    );
                })}
            </div>
        </div>
    );
}

function SectionList({ sections, styles }) {
    if (!sections?.length) return null;
    return sections?.map((section, index) => {
        return section.controlType === controlTypes.SIMPLE ? (
            <section key={`section.id-${index}`} className={styles.section}>
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </section>
        ) : (
            <section key={`section.id-${index}`} className={styles.section}>
                <div className={styles.sectionSide}>
                    <p>{section.duration}</p>
                </div>
                <div className={styles.sectionContent}>
                    <h1>{section.title}</h1>
                    <h2>{section.subtitle}</h2>
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
            </section>
        );
    });
}
