<?php

namespace VLST\VsTypo3Gallery\DataProcessing;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;
use TYPO3\CMS\Extbase\Service\EnvironmentService;
use TYPO3\CMS\Extbase\Service\ImageService;
use TYPO3\CMS\Core\Page\PageRenderer;

/**
 * Class for data processing for the content element "My new content element".
 */
class GalleryProcessor implements DataProcessorInterface
{
    /**
     * @var \TYPO3\CMS\Extbase\Service\ImageService
     */
    protected $imageService;

    protected $processingInstructionsForMainImage = [
        'height' => 800,
    ];

    protected $processingInstructionsForLazyImage = [
        'height' => 25,
    ];

    protected $jsonData = [];

   /**
    * Process data for the content element "My new content element".
    *
    * @param ContentObjectRenderer $cObj The data of the content element or page
    * @param array $contentObjectConfiguration The configuration of Content Object
    * @param array $processorConfiguration The configuration of this processor
    * @param array $processedData Key/value store of processed data (e.g. to be passed to a Fluid View)
    *
    * @return array the processed data as key/value store
    */
   public function process(
      ContentObjectRenderer $cObj,
      array $contentObjectConfiguration,
      array $processorConfiguration,
      array $processedData
   ) {
       $this->imageService = GeneralUtility::makeInstance(ImageService::class);
       $this->imageService->injectEnvironmentService(GeneralUtility::makeInstance(EnvironmentService::class));

       foreach ($processedData['files'] as $file) {
           $processedMainImage = $this->imageService->applyProcessingInstructions($file, $this->processingInstructionsForMainImage);
           $this->jsonData['images'][] = $this->imageService->getImageUri($processedMainImage);

           $processedLazyImage = $this->imageService->applyProcessingInstructions($file, $this->processingInstructionsForLazyImage);
           $this->jsonData['thumbnails'][] = $this->imageService->getImageUri($processedLazyImage);
       }
       $this->getPageRenderer()->addCssFile('EXT:vs_typo3_gallery/Resources/Public/Css/main.css');
       $this->getPageRenderer()->addJsFooterFile('EXT:vs_typo3_gallery/Resources/Public/JavaScript/main.js');
       $processedData['galleryData'] = '<script> var galleryData = '. json_encode($this->jsonData) . '</script>';

       return $processedData;
   }

   /**
     * Wrapper for access to the current page renderer object
     *
     * @return \TYPO3\CMS\Core\Page\PageRenderer
     */
    protected function getPageRenderer()
    {
        if ($this->pageRenderer === null) {
            $this->pageRenderer = GeneralUtility::makeInstance(PageRenderer::class);
        }
        return $this->pageRenderer;
    }
}
