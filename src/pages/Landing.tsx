import React from "react";
import { Box, Typography, Button, Container, Grid, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudAIDiagram from '../assets/cloud-ai-diagram.jpg';
import SystemArchitecture from '../assets/system-architecture.jpg';
import WorkflowAutomationImg from '../assets/workflow-automation.jpg';
import CopyrightInfo from '../assets/copyright.jpg';
import CloudIcon from '@mui/icons-material/Cloud';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SecurityIcon from '@mui/icons-material/Security';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BlockchainIcon from '@mui/icons-material/Token';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import DescriptionIcon from '@mui/icons-material/Description';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InfoIcon from '@mui/icons-material/Info';
import VerifiedIcon from '@mui/icons-material/Verified';
import CodeIcon from '@mui/icons-material/Code';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import StorageIcon from '@mui/icons-material/Storage';
import HubIcon from '@mui/icons-material/Hub';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SnapCodexLogo from '../assets/snap-codex_logo.jpg';

const StyledHero = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(to bottom right, ${theme?.palette?.background?.default || '#ffffff'}, ${theme?.palette?.grey?.[100] || '#f3f4f6'})`,
  padding: theme?.spacing?.(10, 4) || '80px 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme?.palette?.background?.paper || '#ffffff',
  borderRadius: (theme?.shape?.borderRadius || 8) * 2,
  padding: theme?.spacing?.(3) || '24px',
  textAlign: 'center',
  boxShadow: theme?.shadows?.[1] || '0px 2px 1px -1px rgba(0,0,0,0.2)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme?.shadows?.[4] || '0px 2px 4px -1px rgba(0,0,0,0.2)',
  },
}));

const GallerySection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.default} 60%, ${theme.palette.grey[100]} 100%)`,
  padding: theme.spacing(8, 0),
}));

const ImageCard = styled(Box)(({ theme }) => ({
  background: '#fff',
  borderRadius: 24,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1.5px 6px rgba(0,0,0,0.04)',
  overflow: 'hidden',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-6px) scale(1.03)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: 'auto',
}));

const StyledImg = styled('img')({
  width: '100%',
  height: 'auto',
  display: 'block',
  objectFit: 'cover',
  aspectRatio: '16/9',
});

const captions = [
  { src: CloudAIDiagram, alt: '클라우드 기반 AI 설계 플랫폼 분석', label: '클라우드 기반 AI 설계 플랫폼 분석' },
  { src: SystemArchitecture, alt: '시스템 아키텍처와 데이터 흐름', label: '시스템 아키텍처와 데이터 흐름' },
  { src: WorkflowAutomationImg, alt: '워크플로우 자동화 및 IP 검증', label: '워크플로우 자동화 및 IP 검증' },
  { src: CopyrightInfo, alt: '저작권 안내', label: '저작권 안내' },
];

const ModernGallery: React.FC = () => {
  const theme = useTheme();
  return (
    <GallerySection>
      <Grid container spacing={4} justifyContent="center">
        {captions.map(({ src, alt, label }) => (
          <Grid item xs={12} sm={6} md={4} key={alt}>
            <ImageCard>
              <StyledImg src={src} alt={alt} />
              <Box p={2}>
                <Typography variant="subtitle1" color="text.primary" fontWeight={600} align="center">
                  {label}
                </Typography>
              </Box>
            </ImageCard>
          </Grid>
        ))}
      </Grid>
    </GallerySection>
  );
};

// 클라우드 기반 AI 설계 플랫폼 분석
const features = [
  { icon: <CloudIcon fontSize="large" color="primary" />, label: '클라우드 기반' },
  { icon: <SmartToyIcon fontSize="large" color="primary" />, label: 'AI 엔진' },
  { icon: <ViewInArIcon fontSize="large" color="primary" />, label: 'BIM 연계' },
  { icon: <SwapHorizIcon fontSize="large" color="primary" />, label: '데이터 교환' },
  { icon: <SecurityIcon fontSize="large" color="primary" />, label: '저작권 보호' },
  { icon: <CurrencyBitcoinIcon fontSize="large" color="primary" />, label: '블록체인 기술' },
];
function PlatformFeatures() {
  return (
    <Box my={6}>
      <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
        클라우드 기반 AI 설계 플랫폼 분석
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {features.map(({ icon, label }) => (
          <Grid item xs={6} sm={4} md={2} key={label} textAlign="center">
            {icon}
            <Typography variant="subtitle1" mt={1}>{label}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// 시스템 아키텍처와 데이터 흐름
function SystemArchitectureFlow() {
  return (
    <Box my={6}>
      <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
        시스템 아키텍처와 데이터 흐름
      </Typography>
      <Timeline position="alternate">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography fontWeight={600}>설계 모델 업로드</Typography>
            <Typography variant="body2" color="textSecondary">
              BIM, EDX 포맷의 설계 모델을 CodexHub에 업로드
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography fontWeight={600}>CodexHub</Typography>
            <Typography variant="body2" color="textSecondary">
              AI 기반 설계 파일 관리 및 분석 플랫폼
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography fontWeight={600}>SnapPrice</Typography>
            <Typography variant="body2" color="textSecondary">
              AI 기반 비용 계산 엔진
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary" />
          </TimelineSeparator>
          <TimelineContent>
            <Typography fontWeight={600}>CXD 생성</Typography>
            <Typography variant="body2" color="textSecondary">
              Completed/Certified eXchange Data (JSON 형식)
            </Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Box>
  );
}

// 워크플로우 자동화/검증
function WorkflowAutomation() {
  return (
    <Box my={6}>
      <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
        SnapCodex 워크플로우 자동화 및 IP 검증
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Box bgcolor="#fff" borderRadius={4} boxShadow={2} p={4} textAlign="center">
            <IntegrationInstructionsIcon color="primary" fontSize="large" />
            <Typography variant="h6" mt={2}>Workflow Automation</Typography>
            <Typography variant="body2" color="textSecondary">
              Slack, 과거 문서 자동 연동
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box bgcolor="#fff" borderRadius={4} boxShadow={2} p={4} textAlign="center">
            <VerifiedUserIcon color="primary" fontSize="large" />
            <Typography variant="h6" mt={2}>IP Verification</Typography>
            <Typography variant="body2" color="textSecondary">
              NFT, Arweave 등으로 IP 검증
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

// 블록체인 기반 저작권 부여 시스템
function BlockchainSection() {
  return (
    <Box my={6}>
      <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
        블록체인 기반 저작권 부여 시스템
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Box bgcolor="#f5f7fa" borderRadius={4} p={3} mb={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              <BlockchainIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
              블록체인 활용 CXD/NFT 저작권 관리
            </Typography>
            <Typography variant="body2" color="textSecondary">
              블록체인 기술을 활용해 CXD에 고유 토큰(NFT)을 부여하여 저작권을 명시하고, 설계 데이터의 거래를 자동화할 수 있습니다. 각 CXD 데이터는 블록체인에 등록되어 누구나 거래 내역과 소유권을 투명하게 확인할 수 있습니다.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box bgcolor="#f5f7fa" borderRadius={4} p={3} mb={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              <TimelineOutlinedIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
              변경 이력 추적 & 분산 저장
            </Typography>
            <Typography variant="body2" color="textSecondary">
              블록체인은 분산 원장과 암호화를 통해 CXD 데이터의 모든 변경사항과 거래 내역을 시간순으로 기록합니다. 하이퍼레저 등 환경에서 분산 저장과 스마트컨트랙트를 결합해 무단 사용을 방지합니다.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box bgcolor="#fff" borderRadius={4} boxShadow={1} p={3} textAlign="center">
            <LayersOutlinedIcon color="primary" fontSize="large" />
            <Typography variant="subtitle1" fontWeight={600} mt={1}>디지털 건축물 NFT</Typography>
            <Typography variant="body2" color="textSecondary">
              메타버스 공간/가상 건축물에 NFT로 발행하여 저작권과 수익을 보호할 수 있습니다.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box bgcolor="#fff" borderRadius={4} boxShadow={1} p={3} textAlign="center">
            <AccountBalanceWalletOutlinedIcon color="primary" fontSize="large" />
            <Typography variant="subtitle1" fontWeight={600} mt={1}>설계권 토큰화</Typography>
            <Typography variant="body2" color="textSecondary">
              스포츠 경기장 등 설계권을 NFT로 발행해, 설계 사용료를 자동으로 분배하는 새로운 수익 모델을 만들 수 있습니다.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box bgcolor="#fff" borderRadius={4} boxShadow={1} p={3} textAlign="center">
            <SecurityOutlinedIcon color="primary" fontSize="large" />
            <Typography variant="subtitle1" fontWeight={600} mt={1}>마이크로페이먼트 생태계</Typography>
            <Typography variant="body2" color="textSecondary">
              SnapCodex에 블록체인 기술을 적용하면, 설계자는 자신의 CXD가 거래될 때마다 자동으로 로열티를 지급받는 유통/공정 분산 생태계를 구축할 수 있습니다.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function CxdConceptSection() {
  return (
    <Box my={6}>
      <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
        CXD 개념과 구성요소
      </Typography>
      <Box bgcolor="#e3f2fd" borderRadius={2} p={3} mb={3}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          <DescriptionIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
          CXD (Completed/Certified eXchange Data)란?
        </Typography>
        <Typography variant="body2" color="textSecondary">
          CXD는 ML 학습을 거쳐 상품화된 구조화 JSON 데이터로, 건축 자재 목록(BOM)과 공사비 정보 등을 포함하는 디지털 자산입니다.
          설계 및 견적 정보를 한데 묶어 디지털 트윈 역할을 수행하며, AI와 로봇 시스템의 고차원 명령어로 활용될 수 있습니다.
        </Typography>
      </Box>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Box bgcolor="#f5f7fa" borderRadius={2} p={2} mb={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              <ListAltIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
              건축 자재 목록 (BOM)
            </Typography>
            <Typography variant="body2" color="textSecondary">
              설계에 필요한 모든 자재, 부품, 장비 등의 정보와 속성이 포함됩니다. 자재 타입, 규격, 수량, 단위 등이 구조화된 형태로 제공됩니다.
            </Typography>
          </Box>
          <Box bgcolor="#f5f7fa" borderRadius={2} p={2} mb={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              <MonetizationOnIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
              비용 정보 및 견적 내역
            </Typography>
            <Typography variant="body2" color="textSecondary">
              AI가 계산한 부위별 공사비, 단가, 공수 정보가 포함됩니다. 설계 변경 시 실시간으로 비용 변화를 확인할 수 있습니다.
            </Typography>
          </Box>
          <Box bgcolor="#f5f7fa" borderRadius={2} p={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              <InfoIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
              건축 요소 및 속성 정보
            </Typography>
            <Typography variant="body2" color="textSecondary">
              BIM 모델에서 추출한 건축 요소(벽, 바닥, 천장 등)의 속성과 기하학적 정보가 포함됩니다.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box bgcolor="#21222c" color="#fff" borderRadius={2} p={2} mb={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              <CodeIcon sx={{ verticalAlign: 'middle', mr: 1, color: '#90caf9' }} />
              CXD JSON 구조 예시
            </Typography>
            <Box component="pre" sx={{ fontSize: 13, whiteSpace: 'pre-wrap', color: '#fff', background: 'none', m: 0 }}>
{`{
  "cxd_version": "1.0",
  "project_info": {
    "name": "오피스 빌딩 A",
    "client": "ABC 건설",
    "created_date": "2025-04-15"
  },
  "building_materials": [
    {
      "id": "M001",
      "type": "콘크리트",
      "spec": "고강도, 25MPa",
      "quantity": 120.5
    }
  ]
}`}
            </Box>
          </Box>
          <Box bgcolor="#f5f7fa" borderRadius={2} p={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              <VerifiedIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
              CXD의 전략적 가치
            </Typography>
            <Typography variant="body2" color="textSecondary">
              CXD는 설계-시공-견적을 연결하는 디지털 자산입니다. BIM, AI 기술과 결합해 건설 프로세스 자동화와 디지털 전환을 가속화합니다.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

// 저작권 안내
function CopyrightNotice() {
  return (
    <Box my={6} p={4} bgcolor="#f5f7fa" borderRadius={4}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        ⓒ 저작권 안내
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        본 보고서의 저작권은 디자인인사이트(주)에 있으며, 무단 복제 및 인용 시 법적 처벌을 받을 수 있습니다. 
        본 자료의 전체 또는 일부를 활용하려면 반드시 디자인인사이트(주)의 사전 서면 동의를 받아야 합니다.
      </Typography>
      <Box mt={2}>
        <Typography variant="subtitle2" fontWeight={600}>회사 정보</Typography>
        <Typography variant="body2">경기도 김포시 김포대로679번길 14, 타운센트 203호</Typography>
        <Typography variant="body2">02-2603-7252 / FAX 02-6455-7252</Typography>
        <Typography variant="body2">ceo@desinsight.com</Typography>
        <Typography variant="body2">www.desinsight.com</Typography>
      </Box>
    </Box>
  );
}

function SnapCodexOverviewSection() {
  return (
    <Box my={6}>
      <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
        SnapCodex 기술 개요
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              핵심 정의
            </Typography>
            <Box bgcolor="#e3f2fd" borderRadius={2} p={2} mb={2}>
              <Typography fontWeight={700} color="primary" gutterBottom>
                <InfoOutlinedIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                SnapCodex란?
              </Typography>
              <Typography variant="body2" color="textSecondary">
                클라우드 기반의 AI 설계 플랫폼으로, EDX(Enterprise Data eXchange) 포맷의 설계 모델을 업로드하여 구조화된 데이터로 변환하고 공사비를 산출하는 시스템입니다.
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              주요 구성 요소
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <HubIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <b>CodexHub:</b> AI 기반 설계 파일 관리 플랫폼으로, 설계도면을 분석하고 정리하는 기능을 담당합니다.
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <MonetizationOnIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <b>SnapPrice:</b> 이미지나 모델 데이터를 학습한 AI로, 빠르게 건설 비용을 계산합니다.
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <CodeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <b>CXD:</b> Completed/Certified eXchange Data로, ML 학습을 거쳐 상품화된 구조화 JSON 데이터입니다.
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <CloudIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <b>EDX 표준:</b> 신뢰성 높은 데이터 교환 포맷으로, XML 디지털 서명으로 파일 무결성을 검증하고 객체별 암호화를 제공합니다.
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              기술적 특징
            </Typography>
            <Box bgcolor="#e3f2fd" borderRadius={2} p={2} mb={2}>
              <Typography fontWeight={700} color="primary" gutterBottom>
                SnapCodex의 차별점
              </Typography>
              <Typography variant="body2" color="textSecondary">
                설계 데이터를 AI로 학습하여 디지털 자산으로 활용하는 것이 핵심입니다. BIM 모델을 업로드하면 IFC 등 구조화된 BIM 스키마를 JSON으로 변환하여 건축 요소와 수량, 속성 등을 추출합니다.
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              SnapCodex 처리 흐름
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" gap={2} flexWrap="wrap" mt={2}>
              <Box textAlign="center">
                <BuildCircleIcon color="primary" fontSize="large" />
                <Typography variant="caption" display="block">설계 모델</Typography>
              </Box>
              <Typography variant="h6" color="primary">→</Typography>
              <Box textAlign="center">
                <StorageIcon color="primary" fontSize="large" />
                <Typography variant="caption" display="block">구조화 데이터</Typography>
              </Box>
              <Typography variant="h6" color="primary">→</Typography>
              <Box textAlign="center">
                <MonetizationOnIcon color="primary" fontSize="large" />
                <Typography variant="caption" display="block">견적 산출</Typography>
              </Box>
              <Typography variant="h6" color="primary">→</Typography>
              <Box textAlign="center">
                <CodeIcon color="primary" fontSize="large" />
                <Typography variant="caption" display="block">JSON 데이터(CXD)</Typography>
              </Box>
            </Box>
          </Box>
          <Box mt={3} bgcolor="#e3f2fd" borderRadius={2} p={2}>
            <Typography fontWeight={700} color="primary" gutterBottom>
              활용 사례
            </Typography>
            <Typography variant="body2" color="textSecondary">
              BIM 데이터를 현장 작업 지도로 변환하는 Dusty Robotics의 FieldPrinter처럼, SnapCodex/CXD는 설계-시공 간 디지털 트윈 역할을 할 수 있습니다. CXD 데이터는 AI·로봇 시스템의 고차원 명령어로 활용될 수 있습니다.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function SnapCodexLanding() {
  return (
    <StyledHero>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            <img
              src={SnapCodexLogo}
              alt="SnapCodex 로고"
              style={{ height: 56, objectFit: 'contain', maxWidth: '60%', minWidth: 120 }}
            />
          </Box>
          <Typography variant="h5" color="textSecondary" paragraph>
            AI로 설계부터 수주까지 자동화하는 건축 솔루션
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 4, py: 1.5, px: 4 }}
          >
            체험하기
          </Button>
        </Box>

        <SnapCodexOverviewSection />
        <PlatformFeatures />
        <SystemArchitectureFlow />
        <WorkflowAutomation />
        <CxdConceptSection />
        <BlockchainSection />
        <CopyrightNotice />
      </Container>
    </StyledHero>
  );
} 