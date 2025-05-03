#!/usr/bin/env python3
import os
import json
import sys
from datetime import datetime
from github import Github

def get_milestone_progress():
    # GitHub 토큰 가져오기
    github_token = os.environ.get('GITHUB_TOKEN')
    if not github_token:
        raise ValueError("GITHUB_TOKEN environment variable is not set")

    # GitHub 객체 초기화
    g = Github(github_token)
    
    # 리포지토리 가져오기
    repo = g.get_repo(os.environ.get('GITHUB_REPOSITORY', 'desinsight/snap-codex-scheduler'))
    
    # 현재 열린 마일스톤 가져오기
    milestones = repo.get_milestones(state='open')
    
    progress_data = []
    
    for milestone in milestones:
        try:
            issues = repo.get_issues(milestone=milestone, state='all')
            total_issues = 0
            completed_issues = 0
            features = 0
            
            for issue in issues:
                total_issues += 1
                if issue.state == 'closed':
                    completed_issues += 1
                # 레이블 처리 수정
                for label in issue.labels:
                    if 'feature' in label.name.lower():
                        features += 1
                        break
            
            if total_issues > 0:
                completion_percentage = (completed_issues / total_issues) * 100
            else:
                completion_percentage = 0
                
            milestone_data = {
                'title': milestone.title,
                'description': milestone.description or '',
                'due_date': milestone.due_date.isoformat() if milestone.due_date else None,
                'total_issues': total_issues,
                'completed_issues': completed_issues,
                'completion_percentage': round(completion_percentage, 2),
                'features': features
            }
            
            progress_data.append(milestone_data)
        except Exception as e:
            print(f"Error processing milestone {milestone.title}: {str(e)}", file=sys.stderr)
            continue
    
    return progress_data

def main():
    try:
        progress_data = get_milestone_progress()
        
        # 결과를 JSON 파일로 저장
        output_file = 'milestone_progress.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(progress_data, f, ensure_ascii=False, indent=2)
            
        print(f"Progress data has been saved to {output_file}")
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main() 