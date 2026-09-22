import lookbook01 from '@/assets/images/lookbook01.png'
import lookbook02 from '@/assets/images/lookbook02.png'
import lookbook03 from '@/assets/images/lookbook03.png'
import lookbook04 from '@/assets/images/lookbook04.png'
import lookbook05 from '@/assets/images/lookbook05.png'

export interface Look {
  id: string
  /** 공간 라벨 (영문) */
  space: string
  title: string
  description: string
  imageUrl: string
  /** products.ts 의 id 와 연결 */
  productIds: string[]
}

export const looks: Look[] = [
  {
    id: 'living-room',
    space: 'Living Room',
    title: '자연스러운 소재와 균형',
    description:
      '뉴트럴 톤의 패브릭 소파에 유리 상판 테이블과 아치형 조명을 더했습니다. 무겁지 않은 소재가 겹쳐지며 시선이 부드럽게 흐르는 거실입니다.',
    imageUrl: lookbook01,
    productIds: ['sofa-001', 'table-004', 'lighting-001'],
  },
  {
    id: 'dining',
    space: 'Dining',
    title: '매일의 식탁, 오래 앉는 자리',
    description:
      '오크 원목 테이블과 월넛 체어의 결이 서로 다른 톤으로 어우러집니다. 펜던트 조명 아래에서 데일리 다이닝부터 손님 초대까지 자연스럽게 이어집니다.',
    imageUrl: lookbook02,
    productIds: ['table-001', 'chair-001', 'lighting-002'],
  },
  {
    id: 'bedroom',
    space: 'Bedroom',
    title: '잠들기 전, 낮은 온도의 빛',
    description:
      '낮은 원목 프레임과 서랍장으로 높이를 맞추고, 침대 옆에는 따뜻한 테이블 스탠드 하나만 두었습니다. 덜어낼수록 편안해지는 침실입니다.',
    imageUrl: lookbook03,
    productIds: ['bed-002', 'storage-001', 'lighting-003'],
  },
  {
    id: 'reading-corner',
    space: 'Reading Corner',
    title: '한 사람을 위한 작은 자리',
    description:
      '팔걸이가 있는 암체어 옆에 원형 사이드 테이블과 오픈 책장을 놓았습니다. 창가 한 켠이 하루 중 가장 오래 머무는 곳이 됩니다.',
    imageUrl: lookbook04,
    productIds: ['chair-002', 'table-002', 'storage-002'],
  },
  {
    id: 'entryway',
    space: 'Entryway',
    title: '집의 첫인상을 정리하는 법',
    description:
      '슬림한 신발장과 라인형 벽조명만으로 좁은 현관을 정돈했습니다. 바닥 면적은 그대로 두고 벽면을 활용해 답답함을 줄였습니다.',
    imageUrl: lookbook05,
    productIds: ['storage-003', 'lighting-004'],
  },
]