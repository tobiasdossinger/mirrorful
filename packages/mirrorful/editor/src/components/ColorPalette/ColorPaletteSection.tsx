import { Heading } from 'components/core/Heading'
import { ColorRow } from './ColorRow'
import { useEffect, useState } from 'react'
import { TColorData } from '../../types'
import { Button, Box, useDisclosure } from '@chakra-ui/react'
import { generateDefaultColorShades } from './utils'
import { EditColorModal } from './EditColorModal'

export function ColorPaletteSection() {
  const [colors, setColors] = useState<TColorData[]>([])

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isAddingNewColor, setIsAddingNewColor] = useState<boolean>(false)
  const [isExporting, setIsExporting] = useState<boolean>(false)

  const handleExport = async () => {
    setIsExporting(true)

    await fetch('/api/export', {
      method: 'POST',
      body: JSON.stringify({
        colorData: colors,
      }),
    })

    setIsExporting(false)
  }

  useEffect(() => {
    const fetchStoredData = async () => {
      const response = await fetch('/api/store')
      const data = await response.json()
      setColors(data.colorData)
    }

    fetchStoredData()
  }, [])

  return (
    <div>
      <Heading>Color Palette</Heading>
      <div>
        {colors.map((color) => (
          <ColorRow
            key={color.name}
            colorData={color}
            onUpdateColorData={(updatedColorData: TColorData) => {
              const newColors = [...colors]
              const colorIndex = colors.findIndex(
                (ec) => ec.name === color.name
              )
              newColors[colorIndex] = updatedColorData

              setColors(newColors)
            }}
            onDeleteColorData={() => {
              const newColors = colors.filter((c) => c.name !== color.name)

              setColors(newColors)
            }}
          />
        ))}
        <Box
          css={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: '18px',
          }}
        >
          <Button onClick={() => onOpen()}>Add New Color</Button>
          <Button
            onClick={handleExport}
            css={{ marginTop: '16px' }}
            isLoading={isExporting}
          >
            Save and Config
          </Button>
        </Box>
      </div>
      <EditColorModal
        isOpen={isOpen}
        onClose={(colorData?: TColorData) => {
          if (colorData) {
            const newColors = [...colors]
            if (newColors.find((c) => c.name === colorData.name)) {
              colorData.name = colorData.name += ' 2'
            }

            newColors.push(colorData)

            setColors(newColors)
          }
          onClose()
        }}
      />
    </div>
  )
}
