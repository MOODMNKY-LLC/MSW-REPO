import { Client } from '@notionhq/client';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '../../..');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_API_VERSION = '2025-09-03';

const notion = new Client({
  auth: NOTION_API_KEY,
  notionVersion: NOTION_API_VERSION,
});

function getConfig() {
  try {
    const configPath = join(repoRoot, '.notion-config.json');
    return JSON.parse(readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.error('Could not read .notion-config.json:', error.message);
    throw error;
  }
}

async function createBibliographies() {
  const config = getConfig();
  const bibliographyDataSourceId = config.dataSources[config.academicDatabases.bibliographies].id;
  const articleDataSourceId = config.dataSources[config.academicDatabases.articles].id;

  console.log('📚 Creating annotated bibliographies...\n');

  // Bibliography 1: Clinical Social Work
  const bib1 = await notion.pages.create({
    parent: {
      type: 'data_source_id',
      data_source_id: bibliographyDataSourceId,
    },
    properties: {
      Topic: {
        title: [{ text: { content: 'Attachment Theory in Clinical Social Work Practice' } }],
      },
      Course: { select: { name: 'SOCW-6510' } },
      Status: { select: { name: 'Writing' } },
      'Due Date': {
        date: {
          start: '2025-12-15',
        },
      },
    },
    notionVersion: NOTION_API_VERSION,
  });

  console.log('✅ Created Bibliography 1:', bib1.url);

  // Bibliography 2: Child and Family Social Work
  const bib2 = await notion.pages.create({
    parent: {
      type: 'data_source_id',
      data_source_id: bibliographyDataSourceId,
    },
    properties: {
      Topic: {
        title: [{ text: { content: 'Attachment Theory in Child and Family Social Work' } }],
      },
      Course: { select: { name: 'SOCW-6510' } },
      Status: { select: { name: 'Writing' } },
      'Due Date': {
        date: {
          start: '2025-12-15',
        },
      },
    },
    notionVersion: NOTION_API_VERSION,
  });

  console.log('✅ Created Bibliography 2:', bib2.url);

  // Articles for Bibliography 1
  const articles1 = [
    {
      Title: 'Application of attachment theory in clinical social work',
      Authors: 'Blakely, T. J., & Dziadosz, G. M.',
      Year: 2015,
      Journal: 'Health & Social Work',
      'DOI/URL': 'https://doi.org/10.1093/hsw/hlv059',
      Summary: 'This article proposes the use of attachment theory as a framework for assessment and treatment in clinical social work practice. The authors argue that attachment theory is particularly appropriate for social work because of its alignment with core social work concepts including person-in-situation, the significance of developmental history in psychosocial problems, and human behavior in the social environment. The article provides a literature review supporting the theory\'s significance and offers practical ideas about how attachment styles and working models can be used in assessment and treatment to help clients achieve secure attachment.',
      Strengths: 'A strength of this article is its clear articulation of how attachment theory fits within social work\'s theoretical framework, making it highly applicable for practitioners.',
      Weaknesses: 'However, the article is somewhat limited in that it provides more of a conceptual framework rather than empirical evidence of effectiveness, and it focuses primarily on individual therapy rather than broader social work contexts.',
    },
    {
      Title: "'I feel … I need to defend myself': Exploring the influence of social worker's attachment history on the social worker-client relationship",
      Authors: 'Ash, Z., & Grey, B.',
      Year: 2022,
      Journal: 'Human Systems',
      'DOI/URL': 'https://doi.org/10.1177/26344041221115940',
      Summary: 'This qualitative study explores how attachment patterns influence individual social worker-client relationships using an attachment theory-informed Interpretive Phenomenological Analysis methodology. The research employed the Adult Attachment Interview and Meaning of the Client Interview with three practicing child protection social workers, triangulating findings to identify common themes. The study found evidence that specific childhood experiences and dangers are replayed in interactions with clients, though in individualized and context-dependent ways rather than uniform patterns.',
      Strengths: 'A significant strength is the innovative methodology that combines attachment discourse analysis with IPA, providing rich qualitative insights into how social workers\' attachment histories affect their professional relationships.',
      Weaknesses: 'The study\'s limitations include its small sample size (only three participants) and focus specifically on child protection work, which may limit generalizability to other social work contexts. Additionally, the findings suggest that attachment security in social workers does not automatically translate to better client relationships, challenging simplistic assumptions about attachment and professional effectiveness.',
    },
    {
      Title: 'What is adult attachment?',
      Authors: 'Sable, P.',
      Year: 2008,
      Journal: 'Clinical Social Work Journal',
      'DOI/URL': 'https://doi.org/10.1007/s10615-007-0101-9',
      Summary: 'This article provides a comprehensive overview of adult attachment theory and its applications in clinical social work practice. Sable explains the fundamental concepts of attachment theory as they apply to adults, including attachment styles, internal working models, and the continuity of attachment patterns from childhood to adulthood. The article discusses how attachment theory can inform clinical assessment and intervention strategies, particularly in understanding clients\' relational patterns and emotional regulation.',
      Strengths: 'A major strength is the article\'s clear explanation of complex attachment concepts in accessible language, making it valuable for social work practitioners seeking to understand and apply attachment theory. The article effectively bridges theoretical knowledge with clinical application, providing practical guidance for social workers.',
      Weaknesses: 'However, the article is somewhat dated (2008) and may not reflect more recent developments in attachment research, particularly regarding neurobiological findings and contemporary intervention models. Additionally, while the article provides a good theoretical foundation, it offers limited specific intervention techniques or case examples.',
    },
    {
      Title: 'Beginnings of attachment-based therapeutic approaches in clinical social work',
      Authors: 'Bennett, S., & Deal, K. H.',
      Year: 2009,
      Journal: 'Clinical Social Work Journal',
      'DOI/URL': 'https://doi.org/10.1007/s10615-009-0201-9',
      Summary: 'This article explores the development and application of attachment-based therapeutic approaches specifically within clinical social work practice. The authors trace the historical development of attachment theory in social work and discuss how attachment-informed interventions can be integrated into clinical practice. The article examines the therapeutic relationship as a secure base and discusses how social workers can use attachment principles to create healing relationships with clients.',
      Strengths: 'A significant strength is the article\'s focus on the therapeutic relationship as the mechanism of change, which aligns well with social work\'s emphasis on relationship-based practice. The authors provide thoughtful discussion of how attachment theory can inform case conceptualization and treatment planning.',
      Weaknesses: 'However, the article lacks empirical evidence supporting the effectiveness of attachment-based approaches in social work specifically, relying more on theoretical discussion than research findings. The article also does not address potential challenges or limitations of applying attachment theory in diverse social work contexts, such as brief interventions or mandated services.',
    },
    {
      Title: 'The psychotherapy relationship as attachment: Evidence and implications',
      Authors: 'Mallinckrodt, B.',
      Year: 2010,
      Journal: 'Journal of Social and Personal Relationships',
      'DOI/URL': 'https://doi.org/10.1177/0265407509360905',
      Summary: 'This article examines the psychotherapy relationship through the lens of attachment theory, providing evidence for conceptualizing the therapeutic relationship as an attachment relationship. Mallinckrodt reviews research demonstrating how client and therapist attachment styles influence the therapeutic alliance, treatment process, and outcomes. The article discusses implications for clinical practice, including how understanding attachment dynamics can improve therapeutic relationships and treatment effectiveness.',
      Strengths: 'A major strength is the article\'s strong empirical foundation, drawing on multiple research studies to support its arguments about the importance of attachment in therapeutic relationships. The research evidence presented strengthens the case for applying attachment theory in clinical practice.',
      Weaknesses: 'However, the article focuses primarily on psychotherapy relationships rather than the broader range of social work practice contexts, and much of the research cited involves traditional therapy settings rather than social work-specific contexts. Additionally, while the article discusses implications for practice, it provides limited specific guidance on how to apply attachment concepts in day-to-day social work practice.',
    },
  ];

  // Articles for Bibliography 2
  const articles2 = [
    {
      Title: 'Informed decisions in child welfare: The use of attachment theory',
      Authors: 'Mennen, F. E., & O\'Keefe, M.',
      Year: 2005,
      Journal: 'Children and Youth Services Review',
      'DOI/URL': 'https://doi.org/10.1016/j.childyouth.2004.12.002',
      Summary: 'This article addresses how child welfare workers can better understand and utilize attachment theory in their decision-making processes when working with abused and neglected children. The authors provide an overview of attachment theory concepts relevant to child welfare practice and discuss how attachment assessments can inform decisions about placement, reunification, and permanency planning. The article emphasizes the importance of understanding children\'s attachment patterns when making critical decisions about their care and safety.',
      Strengths: 'A significant strength is the article\'s practical focus on applying attachment theory to real-world child welfare decision-making, providing concrete guidance for practitioners. The authors effectively translate complex attachment concepts into actionable knowledge for child welfare workers.',
      Weaknesses: 'However, the article is somewhat dated (2005) and may not reflect current best practices or recent research developments. Additionally, while the article discusses the importance of attachment-informed decisions, it provides limited discussion of the challenges and limitations of applying attachment theory in child welfare contexts, such as time constraints, resource limitations, or cultural considerations.',
    },
    {
      Title: 'Effects of a foster parent training program on young children\'s attachment behaviors: Preliminary evidence from a randomized clinical trial',
      Authors: 'Dozier, M., Lindhiem, O., Lewis, E., Bick, J., Bernard, K., & Peloso, E.',
      Year: 2009,
      Journal: 'Child and Adolescent Social Work Journal',
      'DOI/URL': 'https://doi.org/10.1007/s10560-009-0165-1',
      Summary: 'This randomized controlled trial examines the effectiveness of the Attachment and Biobehavioral Catch-up (ABC) intervention training program for foster parents in improving young children\'s attachment behaviors. The study randomly assigned foster parents to receive either ABC training or a control intervention, then assessed children\'s attachment behaviors using standardized measures. Results indicated that children whose foster parents received ABC training showed improvements in attachment-related behaviors compared to the control group.',
      Strengths: 'A major strength is the rigorous experimental design using randomization, which provides strong evidence for causal effects of the intervention. The study addresses a critical population (young children in foster care) and uses validated attachment assessment measures. The findings have important implications for child welfare practice, demonstrating that training foster parents in attachment-sensitive caregiving can improve children\'s attachment outcomes.',
      Weaknesses: 'However, the study reports preliminary findings and may have limited sample size, and the intervention requires trained facilitators which may limit its immediate scalability. Additionally, the study focuses specifically on foster care contexts and may have limited generalizability to other child welfare settings such as kinship care or reunification contexts.',
    },
    {
      Title: 'Reassessing attachment theory in child welfare',
      Authors: 'White, S., Wastell, D., Waring, A., & Featherstone, B.',
      Year: 2020,
      Journal: 'Child & Family Social Work',
      'DOI/URL': 'https://doi.org/10.1111/cfs.12681',
      Summary: 'This article provides a critical reassessment of attachment theory\'s role and application in child welfare practice, questioning some of the assumptions and ways attachment theory has been used in social work. The authors examine how attachment theory has become dominant in child welfare discourse and discuss both its contributions and limitations. The article addresses concerns about how attachment theory may pathologize families, overlook structural factors, and be applied in ways that may not serve children and families well.',
      Strengths: 'A significant strength is the article\'s critical perspective, which challenges uncritical application of attachment theory and encourages more nuanced, thoughtful use of the theory in practice. The authors provide important cautions about potential misuse of attachment concepts in child welfare decision-making.',
      Weaknesses: 'However, the article is somewhat critical without providing extensive alternative frameworks or solutions, and some readers may find it overly skeptical of attachment theory\'s value. Additionally, while the critique is valuable, the article provides limited guidance on how to appropriately apply attachment theory in ways that address the concerns raised.',
    },
    {
      Title: 'Enhancing attachment organization among maltreated children: Results of a randomized clinical trial',
      Authors: 'Bernard, K., Dozier, M., Bick, J., Lewis-Morrarty, E., Lindhiem, O., & Carlson, E.',
      Year: 2012,
      Journal: 'Child Development',
      'DOI/URL': 'https://doi.org/10.1111/j.1467-8624.2011.01712.x',
      Summary: 'This randomized controlled trial examines the effectiveness of the Attachment and Biobehavioral Catch-up (ABC) intervention in enhancing attachment organization among maltreated children in foster care. The study randomly assigned foster parents to receive either the ABC intervention or a control intervention, then assessed children\'s attachment security using the Strange Situation Procedure. Results demonstrated that children whose foster parents received ABC showed significantly greater improvements in attachment security compared to the control group.',
      Strengths: 'A major strength is the rigorous randomized controlled trial design, which provides strong evidence for the intervention\'s effectiveness. The study addresses a critical population (maltreated children in foster care) and uses gold-standard attachment assessment measures. The findings have important implications for child welfare practice, suggesting that attachment-focused interventions can effectively improve outcomes for vulnerable children.',
      Weaknesses: 'However, the study focuses specifically on foster care contexts and may have limited generalizability to other child welfare settings. Additionally, the intervention requires trained facilitators and may not be immediately scalable to all child welfare agencies without significant resources for training and implementation.',
    },
    {
      Title: 'Developmental attachment psychotherapy with fostered and adopted children',
      Authors: 'Howe, D.',
      Year: 2006,
      Journal: 'Child and Adolescent Mental Health',
      'DOI/URL': 'https://doi.org/10.1111/j.1475-3588.2006.00402.x',
      Summary: 'This article describes Developmental Attachment Psychotherapy (DAP), an intervention approach for children in foster care and adoption who have experienced abuse and neglect. Howe explains how attachment theory informs understanding of these children\'s difficulties and describes therapeutic approaches that address attachment-related issues. The article discusses the importance of creating secure attachment relationships for children who have experienced early trauma and disruption.',
      Strengths: 'A strength is the article\'s focus on a highly vulnerable population (children in foster care and adoption) and its practical discussion of therapeutic approaches. Howe\'s extensive experience in this area lends credibility to the recommendations provided.',
      Weaknesses: 'However, the article is somewhat dated (2006) and may not reflect the most current research or intervention approaches. Additionally, while the article describes therapeutic approaches, it provides limited empirical evidence of effectiveness, relying more on theoretical discussion and clinical experience than research findings. The article also focuses primarily on individual therapy rather than broader systemic or family-based approaches that are often needed in child welfare contexts.',
    },
  ];

  console.log('\n📄 Creating articles for Bibliography 1...\n');
  for (const article of articles1) {
    const page = await notion.pages.create({
      parent: {
        type: 'data_source_id',
        data_source_id: articleDataSourceId,
      },
      properties: {
        Title: {
          title: [{ text: { content: article.Title } }],
        },
        Authors: { rich_text: [{ text: { content: article.Authors } }] },
        Year: { number: article.Year },
        Journal: { rich_text: [{ text: { content: article.Journal } }] },
        'DOI/URL': { url: article['DOI/URL'] },
        Summary: { rich_text: [{ text: { content: article.Summary } }] },
        Strengths: { rich_text: [{ text: { content: article.Strengths } }] },
        Weaknesses: { rich_text: [{ text: { content: article.Weaknesses } }] },
      },
      notionVersion: NOTION_API_VERSION,
    });
    console.log(`✅ Created: ${article.Title}`);
  }

  console.log('\n📄 Creating articles for Bibliography 2...\n');
  for (const article of articles2) {
    const page = await notion.pages.create({
      parent: {
        type: 'data_source_id',
        data_source_id: articleDataSourceId,
      },
      properties: {
        Title: {
          title: [{ text: { content: article.Title } }],
        },
        Authors: { rich_text: [{ text: { content: article.Authors } }] },
        Year: { number: article.Year },
        Journal: { rich_text: [{ text: { content: article.Journal } }] },
        'DOI/URL': { url: article['DOI/URL'] },
        Summary: { rich_text: [{ text: { content: article.Summary } }] },
        Strengths: { rich_text: [{ text: { content: article.Strengths } }] },
        Weaknesses: { rich_text: [{ text: { content: article.Weaknesses } }] },
      },
      notionVersion: NOTION_API_VERSION,
    });
    console.log(`✅ Created: ${article.Title}`);
  }

  console.log('\n✅ All bibliographies and articles created successfully!');
  console.log(`\n📚 Bibliography 1: ${bib1.url}`);
  console.log(`📚 Bibliography 2: ${bib2.url}`);
}

createBibliographies().catch(console.error);

