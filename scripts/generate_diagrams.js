const https = require('https');
const fs = require('fs');
const path = require('path');

const diagrams = {
    'level0_dfd': `graph TD
        %% Context Diagram
        classDef default fill:#fff,stroke:#333,stroke-width:2px,color:#000;
        
        Student((Student))
        Teacher((Teacher))
        System[0.0 Alchemistry Virtual Lab]
        AuthDB[(Supabase Auth & DB)]
        
        Student -- "Login Credentials\\nExperiment Inputs" --> System
        System -- "3D Visuals, Lab Results" --> Student
        Teacher -- "Create Classes\\nManage Chemicals" --> System
        System -- "Class Codes\\nMeeting Links" --> Teacher
        System -- "Data Queries\\nSave Records" --> AuthDB
        AuthDB -- "Auth Tokens\\nReaction Results" --> System`,
        
    'level1_dfd': `graph TD
        classDef default fill:#fff,stroke:#333,stroke-width:2px,color:#000;
        
        Student((Student))
        Teacher((Teacher))
        UserStore[(D1: auth.users)]
        ClassStore[(D2: classrooms)]
        ExpStore[(D3: experiment_results)]
        
        P1[1.0 Dashboard & Auth Management]
        P2[2.0 Classroom Management]
        P3[3.0 3D Lab Simulation Engine]
        
        Student -- "Auth Request" --> P1
        P1 -- "Token / Profile" --> Student
        P1 -- "Read/Write Info" --> UserStore
        
        Student -- "Select Chemicals" --> P3
        P3 -- "Render 3D Reaction" --> Student
        P3 -- "Save Attempt" --> ExpStore
        
        Teacher -- "Set up Class" --> P2
        P2 -- "Create/Update Record" --> ClassStore
        P2 -- "Class Overview" --> Teacher`,
        
    'level2_dfd': `graph TD
        classDef default fill:#fff,stroke:#333,stroke-width:2px,color:#000;
        
        Input((Experiment Input))
        ReactionDB[(D4: results)]
        ExpStore[(D3: experiment_results)]
        
        P3_1[3.1 Apply State to 3D Canvas]
        P3_2[3.2 Calculate Chemical Combination]
        P3_3[3.3 Generate UI Feedback]
        
        Input -- "Chemical Sliders" --> P3_1
        Input -- "Submit Mixing Event" --> P3_2
        
        P3_2 -- "Query Mix Match" --> ReactionDB
        ReactionDB -- "Reaction Details" --> P3_2
        
        P3_2 -- "Update 3D Models" --> P3_1
        P3_1 -- "Three.js Canvas Output" --> Output((To Screen))
        
        P3_2 -- "Score & Result Name" --> P3_3
        P3_3 -- "Update History Log" --> ExpStore
        P3_3 -- "Display Modal" --> Output`,
        
    'ar_pipeline': `graph TD
        classDef default fill:#fff,stroke:#333,stroke-width:2px,color:#000;
        
        subgraph "Physical World Constraints"
            UserAction[User Input: Mouse Hover / Click / Drag]
            Canvas[Browser Viewport Window]
        end
        subgraph "Digital 3D Engine (React Three Fiber)"
            State[Zustand Lab State Manager]
            Renderer[Three.js WebGL Renderer]
            Camera[Perspective Camera / OrbitControls]
            Models[3D Models: Beakers, TestTubes]
            Shaders[Fluid Dynamics Shaders]
            Environment[HDR Environment Lighting]
        end
        
        UserAction -- "Updates Global State" --> State
        State -- "Alters Model Transforms" --> Models
        State -- "Alters Shader Colors" --> Shaders
        Models --> Renderer
        Shaders --> Renderer
        Environment --> Renderer
        Camera --> Renderer
        Renderer -- "Superimposes 3D Models" --> Canvas`,
        
    'er_model': `erDiagram
        USER {
            uuid id PK
            string email
            string role
            timestamp created_at
        }
        CLASSROOM {
            uuid id PK
            string class_name
            string class_code
            string meeting_type
            string meeting_link
            string locked_chemicals
            uuid teacher_id FK
        }
        EXPERIMENT_RESULTS {
            uuid id PK
            uuid user_id FK
            string experiment_type
            integer chem_a
            integer chem_b
            integer chem_c
            integer chem_d
            string result_name
            string result_formula
            integer score
            timestamp created_at
        }
        RESULTS {
            integer id PK
            integer conc_a
            integer conc_b
            integer conc_c
            integer conc_d
            integer reaction_id
            string result_name
            string result_formula
            string color
            string characteristics
        }
        USER ||--o{ CLASSROOM : "manages"
        USER ||--o{ EXPERIMENT_RESULTS : "performs"
        EXPERIMENT_RESULTS }|--|| RESULTS : "tracks"`
};

const outputDir = path.join(__dirname, '..', 'docs', 'diagrams');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadDiagram(name, source) {
    const payload = JSON.stringify({
        diagram_source: source,
        diagram_type: 'mermaid',
        output_format: 'png'
    });

    const options = {
        hostname: 'kroki.io',
        port: 443,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(\`Failed to generate \${name}, status code: \${res.statusCode}\`));
                return;
            }
            const filePath = path.join(outputDir, \`\${name}.png\`);
            const fileStream = fs.createWriteStream(filePath);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(\`Successfully saved \${name}.png\`);
                resolve();
            });
        });

        req.on('error', (e) => reject(e));
        req.write(payload);
        req.end();
    });
}

async function main() {
    console.log('Generating high-res PNG diagrams via Kroki...');
    for (const [name, source] of Object.entries(diagrams)) {
        try {
            await downloadDiagram(name, source);
        } catch (e) {
            console.error(\`Error on \${name}:\`, e.message);
        }
    }
    console.log(\`Done! Diagrams saved to \${outputDir}\`);
}

main();
