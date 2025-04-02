
enum PossibleCategories {
    ABOUT_US = "about_us",
    SERVICES = "services",
    CASE_STUDIES = "case_studies",
    BLOG = "blog",
    CONTACT = "contact",
    CAREERS = "careers",
    TESTIMONIALS = "testimonials",
    FAQ = "faq",
    TERMS_OF_SERVICE = "terms_of_service",
    PRIVACY_POLICY = "privacy_policy",
    TEAM = "team",
}

interface PageCategory {
    key: PossibleCategories;
    label: string;
    description: string;
    synonyms: string[];
}

export const pageCategories: PageCategory[] = [
    {
        key: PossibleCategories.ABOUT_US,
        label: "About Us",
        description: "Information about the company and its mission",
        synonyms: ["about", "company", "mission"],  
    },
    {
        key: PossibleCategories.SERVICES,
        label: "Services",
        description: "Information about the services offered by the company",
        synonyms: ["services", "products", "solutions"],
    },
    {
        key: PossibleCategories.CASE_STUDIES,
        label: "Case Studies",
        description: "Information about the case studies and projects completed by the company",
        synonyms: ["case studies", "projects", "work"],
    },
    {
        key: PossibleCategories.BLOG,
        label: "Blog",
        description: "Information about the blog posts and articles written by the company",
        synonyms: ["blog", "articles", "posts"],
    },
    {
        key: PossibleCategories.CONTACT,
        label: "Contact",
        description: "Information about the contact details of the company",
        synonyms: ["contact", "contact us", "contact information"],
    },
    {
        key: PossibleCategories.CAREERS,
        label: "Careers",
        description: "Information about the job openings and career opportunities at the company",
        synonyms: ["careers", "jobs", "employment"],
    },
    {
        key: PossibleCategories.TESTIMONIALS,
        label: "Testimonials",
        description: "Information about the testimonials and reviews of the company",
        synonyms: ["testimonials", "reviews", "feedback"],
    },
    {
        key: PossibleCategories.FAQ,
        label: "FAQ",
        description: "Information about the frequently asked questions and answers of the company",
        synonyms: ["faq", "questions", "answers"],
    },
    {
        key: PossibleCategories.TERMS_OF_SERVICE,
        label: "Terms of Service",
        description: "Information about the terms of service and conditions of the company",
        synonyms: ["terms of service", "conditions", "terms"],
    },
    {
        key: PossibleCategories.PRIVACY_POLICY,
        label: "Privacy Policy",
        description: "Information about the privacy policy of the company",
        synonyms: ["privacy policy", "privacy", "policy"],
    },
    {
        key: PossibleCategories.TEAM,
        label: "Team",
        description: "Information about the team members of the company",
        synonyms: ["team", "members", "team members"],
    },
];
