from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def section_heading(title, styles, flow):
    heading_table = Table(
        [[Paragraph(f"<b>{title.upper()}</b>", styles["section_title"])]],
        colWidths=[182 * mm],
    )
    heading_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F3F6FC")),
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#1F3A5F")),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LINEBELOW", (0, 0), (-1, -1), 0.5, colors.HexColor("#D5DEEE")),
            ]
        )
    )
    flow.append(heading_table)
    flow.append(Spacer(1, 1.6 * mm))


def section(title, body, styles, flow):
    section_heading(title, styles, flow)
    for line in body:
        flow.append(Paragraph(line, styles["body"]))
        flow.append(Spacer(1, 0.72 * mm))
    flow.append(Spacer(1, 1.5 * mm))


def certifications_two_by_two(styles, flow):
    """Four certs in a 2x2 grid (two per row)."""
    section_heading("Certifications", styles, flow)
    cert_style = ParagraphStyle(
        "cert",
        parent=styles["body"],
        fontSize=8.4,
        leading=11.2,
        textColor=colors.HexColor("#1D2733"),
    )
    row1 = [
        Paragraph("- Full Stack Development Certification", cert_style),
        Paragraph("- Java Programming Certification", cert_style),
    ]
    row2 = [
        Paragraph("- SQL &amp; Database Management Certification", cert_style),
        Paragraph("- AWS Cloud Fundamentals", cert_style),
    ]
    w = 89 * mm
    cert_table = Table([row1, row2], colWidths=[w, w])
    cert_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    flow.append(cert_table)
    flow.append(Spacer(1, 1.2 * mm))


def header_block(styles, flow):
    header = Table(
        [
            [Paragraph("Rishika Modi", styles["name"])],
        ],
        colWidths=[182 * mm],
    )
    header.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFFFFF")),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LINEBELOW", (0, 0), (-1, 0), 1.2, colors.HexColor("#0F4C81")),
            ]
        )
    )
    flow.append(header)
    flow.append(Spacer(1, 3.4 * mm))


def main():
    out = "Rishika_Modi_Resume.pdf"
    doc = SimpleDocTemplate(
        out,
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=14 * mm,
        topMargin=9 * mm,
        bottomMargin=12 * mm,
    )
    base = getSampleStyleSheet()
    styles = {
        "name": ParagraphStyle(
            "name",
            parent=base["Heading1"],
            fontSize=19.5,
            leading=23,
            textColor=colors.HexColor("#0D223A"),
            spaceAfter=1,
        ),
        "contact": ParagraphStyle(
            "contact",
            parent=base["Normal"],
            fontSize=9.5,
            leading=13.2,
            textColor=colors.HexColor("#2E3B4E"),
        ),
        "section_title": ParagraphStyle(
            "section_title",
            parent=base["Heading2"],
            fontSize=9,
            leading=10.9,
            textColor=colors.HexColor("#1F3A5F"),
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontSize=8.9,
            leading=11.8,
            textColor=colors.HexColor("#1D2733"),
        ),
    }

    story = []
    header_block(styles, story)

    section(
        "Professional Summary",
        [
            "Full Stack Developer with <b>3 years of experience</b> in web apps, backend APIs, and data workflows. Strong in <b>JavaScript, Java, SQL, Angular</b>, REST APIs, and cloud basics.",
        ],
        styles,
        story,
    )

    section(
        "Core Skills",
        [
            "<b>Languages:</b> Java, JavaScript, SQL | <b>Frontend:</b> Angular, HTML5, CSS3, Bootstrap | <b>Backend/API:</b> Node.js, Express.js, REST APIs",
            "<b>Databases:</b> MySQL, PostgreSQL, MongoDB | <b>Data:</b> SQL, ETL concepts, dbt (working knowledge) | <b>Tools:</b> AWS (Lambda/S3), Git, GitHub Actions, Postman",
        ],
        styles,
        story,
    )

    section(
        "Professional Experience",
        [
            "<b>Full Stack Developer | Digichum Infotech, Indore | Jun 2024 - Present</b>",
            "- Angular workflow modules, REST API integration, SQL optimization, automated reports, releases &amp; bug fixes.",
            "- Worked closely with QA and business stakeholders to convert requirements into stable production features.",
            "- Improved response consistency through API validation and structured error-handling patterns.",
            "<b>Software Developer (Internship) | Indore | Jul 2023 - May 2024</b>",
            "- End-to-end modules (JavaScript, Java, SQL), CRUD APIs, reporting UI, Git collaboration.",
            "- Contributed to debugging and enhancement of existing modules to improve usability and performance.",
            "<b>Junior Developer (Projects) | Indore | Jul 2022 - Jun 2023</b>",
            "- Full-stack mini-projects: UI, APIs, DB integration; clean code &amp; testing fundamentals.",
            "- Built reusable frontend components and integrated backend endpoints for project deliverables.",
        ],
        styles,
        story,
    )

    section(
        "Projects",
        [
            "<b>Synkup CRM</b>",
            "- Built and maintained core CRM workflow modules for lead tracking, follow-ups, and status management.",
            "- Integrated secure REST APIs for seamless data exchange between frontend and backend services.",
            "- Improved SQL query performance for listing and reporting screens to support faster operations.",
            "- Supported bug fixes, feature enhancements, QA coordination, and release deployment cycles.",
            "- <i>Tech:</i> Angular, Java/Node.js, SQL, REST APIs, Git.",
            "<b>API Integration &amp; Data Automation Utility</b>",
            "- Developed reusable integration services for external APIs and internal business systems.",
            "- Designed recurring sync jobs to automate data movement and reduce manual operational effort.",
            "- Added validation rules, structured logs, and exception handling to improve reliability.",
            "- Implemented retry handling and monitoring-ready responses for stable scheduled execution.",
            "- <i>Tech:</i> Node.js, JavaScript, SQL, REST APIs, GitHub Actions/Scheduler.",
        ],
        styles,
        story,
    )

    section(
        "Education",
        [
            "<b>B.Tech</b> — Medicaps University",
            "<b>Class 12</b> — Sita Devi School, Indore",
        ],
        styles,
        story,
    )

    certifications_two_by_two(styles, story)

    doc.build(story)
    print(out)


if __name__ == "__main__":
    main()
