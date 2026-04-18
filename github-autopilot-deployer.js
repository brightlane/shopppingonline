const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const GITHUB_REPO_PATH = "/path/to/your/repository";  // Replace with your repo path
const GITHUB_BRANCH = "main";  // Specify the branch to deploy to
const COMMIT_MESSAGE = "Automated update: new article batch and product updates"; // Commit message

/**
 * GitHub Auto-Pilot Deployer Class
 */
class GitHubAutoPilotDeployer {

  constructor() {
    this.repoPath = GITHUB_REPO_PATH;
    this.branch = GITHUB_BRANCH;
    this.commitMessage = COMMIT_MESSAGE;
  }

  log(msg) {
    console.log("[GitHub-AutoPilot]", msg);
  }

  /**
   * 1. Clone the repository (if not already cloned)
   */
  cloneRepo() {
    if (!fs.existsSync(this.repoPath)) {
      this.log("Cloning repository...");
      exec(`git clone https://github.com/your-username/your-repo.git ${this.repoPath}`, (err, stdout, stderr) => {
        if (err) {
          this.log(`Error cloning repo: ${stderr}`);
          return;
        }
        this.log("Repository cloned successfully!");
        this.commitChanges();  // Run commit after clone
      });
    } else {
      this.log("Repository already exists. Proceeding with commit...");
      this.commitChanges();
    }
  }

  /**
   * 2. Commit the generated files to the repository
   */
  commitChanges() {
    this.log("Committing changes...");

    exec(`cd ${this.repoPath} && git checkout ${this.branch} && git add . && git commit -m "${this.commitMessage}"`, (err, stdout, stderr) => {
      if (err) {
        this.log(`Error committing changes: ${stderr}`);
        return;
      }
      this.log("Changes committed successfully.");
      this.pushChanges();  // Push after commit
    });
  }

  /**
   * 3. Push the changes to GitHub
   */
  pushChanges() {
    this.log("Pushing changes to GitHub...");

    exec(`cd ${this.repoPath} && git push origin ${this.branch}`, (err, stdout, stderr) => {
      if (err) {
        this.log(`Error pushing changes: ${stderr}`);
        return;
      }
      this.log("Changes pushed to GitHub successfully.");
      this.triggerBuild();  // Trigger build after push
    });
  }

  /**
   * 4. Trigger GitHub Actions to rebuild the site (if using GitHub Actions)
   */
  triggerBuild() {
    this.log("Triggering GitHub Actions build...");

    exec(`curl -X POST https://api.github.com/repos/your-username/your-repo/dispatches \
      -H "Accept: application/vnd.github.v3+json" \
      -d '{"event_type": "deploy"}'`, (err, stdout, stderr) => {
      if (err) {
        this.log(`Error triggering build: ${stderr}`);
        return;
      }
      this.log("GitHub Actions build triggered successfully.");
    });
  }

  /**
   * 5. Run the full deploy workflow
   */
  run() {
    this.log("Starting GitHub Auto-Pilot Deployer...");

    this.cloneRepo();
  }
}

const deployer = new GitHubAutoPilotDeployer();
deployer.run();
